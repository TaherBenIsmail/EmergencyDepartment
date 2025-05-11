"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import Subtitles from "./Subtitles";
import SubtitlesDemoOverlay from "./SubtitlesDemoOverlay";
import useSpeechTranslation from "@/hooks/useSpeechTranslation";

interface WebRTCRoomProps {
  consultationId: string;
  userId: string;
  onEnd: () => void;
}

export default function WebRTCRoom({ consultationId, userId, onEnd }: WebRTCRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [showDemoSubtitles, setShowDemoSubtitles] = useState(false);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // Utiliser notre hook personnalisé pour la reconnaissance vocale et la traduction
  const {
    transcript: localTranscript,
    translatedText: localTranslatedText,
    startListening: startLocalListening,
    stopListening: stopLocalListening,
    detectedLanguage: localDetectedLanguage
  } = useSpeechTranslation({
    autoStart: true,
    continuous: true
  });

  // Afficher la démonstration après un court délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDemoSubtitles(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        console.log("Initializing WebRTC...");
        setConnectionStatus("Connecting to signaling server...");

        // Initialize Socket.io connection
        const socketIo = io("http://localhost:3000", {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        });

        socketIo.on('connect', () => {
          console.log("Connected to signaling server");
          setConnectionStatus("Connected to signaling server");
        });

        socketIo.on('connect_error', (error) => {
          console.error("Socket connection error:", error);
          setConnectionStatus("Connection error: " + error.message);
        });

        setSocket(socketIo);

        console.log("Requesting media permissions...");
        setConnectionStatus("Requesting camera and microphone access...");

        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media permissions granted");
        setLocalStream(stream);
        setConnectionStatus("Media permissions granted");

        // Initialize WebRTC peer connection
        console.log("Creating peer connection...");
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" },
          ],
        });
        peerConnection.current = pc;

        // Add local stream to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle incoming remote stream
        pc.ontrack = (event) => {
          console.log("Received remote stream");
          setRemoteStream(event.streams[0]);
          setConnectionStatus("Remote stream received");
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("New ICE candidate");
            socketIo.emit("ice-candidate", event.candidate, consultationId, userId);
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", pc.iceConnectionState);
          setConnectionStatus("ICE state: " + pc.iceConnectionState);
        };

        // Join room
        console.log("Joining room:", consultationId);
        socketIo.emit("join-room", consultationId, userId);
        setConnectionStatus("Joining consultation room...");

        // Handle WebRTC signaling
        socketIo.on("user-connected", async (connectedUserId) => {
          console.log("User connected:", connectedUserId);
          if (connectedUserId !== userId) {
            console.log("Creating offer...");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketIo.emit("offer", offer, consultationId, userId);
            setConnectionStatus("Offer created and sent");
          }
        });

        socketIo.on("offer", async (offer, senderId) => {
          console.log("Received offer from:", senderId);
          if (senderId !== userId) {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketIo.emit("answer", answer, consultationId, userId);
            setConnectionStatus("Answer created and sent");
          }
        });

        socketIo.on("answer", async (answer, senderId) => {
          console.log("Received answer from:", senderId);
          if (senderId !== userId) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            setConnectionStatus("Connection established");
          }
        });

        socketIo.on("ice-candidate", async (candidate, senderId) => {
          console.log("Received ICE candidate from:", senderId);
          if (senderId !== userId) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        return () => {
          console.log("Cleaning up...");
          stream.getTracks().forEach((track) => track.stop());
          pc.close();
          socketIo.disconnect();
        };
      } catch (error) {
        console.error("Error initializing WebRTC:", error);
        setError("Failed to initialize video consultation: " + (error as Error).message);
        setConnectionStatus("Error: " + (error as Error).message);
      }
    };

    initializeWebRTC();
  }, [consultationId, userId]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);

      // Si on désactive l'audio, on arrête aussi la reconnaissance vocale
      if (!audioTrack.enabled) {
        stopLocalListening();
      } else {
        startLocalListening();
      }
    }
  };

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  const changeTargetLanguage = () => {
    setTargetLanguage(targetLanguage === "en" ? "fr" : "en");
  };

  const handleEndConsultation = async () => {
    try {
      const token = localStorage.getItem("token");

      try {
        // First try with the consultation ID
        let response = await axios.post(
          `http://localhost:3000/api/consultations/${consultationId}/end`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Successfully ended consultation:", response.data);

        // Show success message
        setShowCompletedMessage(true);

        // Wait 2 seconds before closing
        setTimeout(() => {
          if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
          }
          if (peerConnection.current) {
            peerConnection.current.close();
          }
          if (socket) {
            socket.disconnect();
          }
          // Call onEnd to update parent component
          onEnd();
        }, 2000);

        return; // Exit early
      } catch (apiError) {
        console.error("API error when ending consultation:", apiError);
        // Continue with cleanup even if API call fails
      }

      // If we get here, the API call failed
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (socket) {
        socket.disconnect();
      }

      // Still call onEnd to update parent component
      onEnd();
    } catch (error) {
      console.error("Error ending consultation:", error);
      setError("Failed to end consultation");

      // Still call onEnd to update parent component even on error
      setTimeout(() => {
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnection.current) {
          peerConnection.current.close();
        }
        if (socket) {
          socket.disconnect();
        }
        onEnd();
      }, 2000);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="text-gray-600 mb-6">
          <p>La connexion a échoué, mais vous pouvez quand même tester les sous-titres en mode démonstration.</p>
        </div>
        <button
          onClick={onEnd}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 mb-4"
        >
          Back
        </button>

        {showDemoSubtitles && (
          <div className="w-full max-w-4xl">
            <h3 className="text-lg font-semibold text-dark dark:text-white mb-2 text-center">
              Démonstration des sous-titres en temps réel
            </h3>
            <SubtitlesDemoOverlay onClose={() => setShowDemoSubtitles(false)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {showCompletedMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Consultation Completed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The consultation has been successfully marked as completed.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      )}

      {showDemoSubtitles && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Démonstration des sous-titres en temps réel
              </h2>
              <button
                onClick={() => setShowDemoSubtitles(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <SubtitlesDemoOverlay onClose={() => setShowDemoSubtitles(false)} />
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-dark rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Video Consultation
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {connectionStatus}
            </p>
          </div>
          <button
            onClick={handleEndConsultation}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            End Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <Subtitles
              text={localTranscript}
              isVisible={showSubtitles && isAudioEnabled}
              position="bottom"
              language={localDetectedLanguage}
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={toggleVideo}
                className={`p-2 rounded-full ${
                  isVideoEnabled ? "bg-green-500" : "bg-red-500"
                } text-white`}
              >
                {isVideoEnabled ? "🎥" : "🚫"}
              </button>
              <button
                onClick={toggleAudio}
                className={`p-2 rounded-full ${
                  isAudioEnabled ? "bg-green-500" : "bg-red-500"
                } text-white`}
              >
                {isAudioEnabled ? "🎤" : "🚫"}
              </button>
              <button
                onClick={toggleSubtitles}
                className={`p-2 rounded-full ${
                  showSubtitles ? "bg-green-500" : "bg-gray-500"
                } text-white font-bold text-xs`}
                title="Activer/désactiver les sous-titres"
              >
                CC
              </button>
              <button
                onClick={changeTargetLanguage}
                className="p-2 rounded-full bg-blue-500 text-white font-bold text-xs"
                title="Changer la langue de traduction"
              >
                {targetLanguage === "en" ? "FR→EN" : "EN→FR"}
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <Subtitles
              text={localTranslatedText}
              isVisible={showSubtitles && isAudioEnabled}
              position="bottom"
              language={targetLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}