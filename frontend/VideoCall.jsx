import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const App = () => {
    const [roomId, setRoomId] = useState('');
    const [localStream, setLocalStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    useEffect(() => {
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
        };
    }, []);

    const startCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, roomId);
            }
        };

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', offer, roomId);
    };

    const joinCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, roomId);
            }
        };

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        socket.emit('joinRoom', roomId);
    };

    const handleOffer = async (offer) => {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, roomId);
            }
        };

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', answer, roomId);
    };

    const handleAnswer = async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = (candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    return (
        <div>
            <h1>Video Call</h1>
            <input 
                type="text" 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)} 
                placeholder="Room ID" 
            />
            <button onClick={startCall}>Start Call</button>
            <button onClick={joinCall}>Join Call</button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <video ref={localVideoRef} autoPlay muted style={{ width: '45%' }} />
                <video ref={remoteVideoRef} autoPlay style={{ width: '45%' }} />
            </div>
        </div>
    );
};

export default App;
