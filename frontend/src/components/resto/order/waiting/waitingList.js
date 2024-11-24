import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getOrderId } from '../orderDB';
import './WaitingList.css';
import { getProfileIdFromCart } from '../cart/cartDB';
import config from '../../config';

function WaitingList() {
    const location = useLocation();
    const navigate = useNavigate();
    const { idOrder } = location.state || {};
    const [status, setStatus] = useState('');
    const [socket, setSocket] = useState(null);
    const [isBtnVisible, setIsBtnVisible] = useState({ status: true, toBarcode: false });
    const audioRef = useRef(null);

    const ORDER_STATUS = {
        READY: 'ready',
        DONE: 'done',
        PENDING: 'pending',
    };

    const handleBackToInitial = () => {
        stopMusic();
        const initialURL = sessionStorage.getItem('initialURL') || '/';
        navigate(initialURL);
    };

    const fetchServeType = async () => {
        try {
            const profileId = await getProfileIdFromCart();
            const response = await fetch(`${config.baseURL}/api/settings/profile/${profileId}`);
            const data = await response.json();
            const serveType = data[0]?.serveType;

            if (serveType === 2) {
                setIsBtnVisible({ status: false, toBarcode: true });
            }
        } catch (error) {
            console.error('Gagal mengambil serveType:', error);
        }
    };

    const checkOrderStatus = async () => {
        try {
            const idOrderDB = await getOrderId();
            if (!idOrderDB) {
                console.error('ID Order tidak ditemukan.');
                return;
            }

            const response = await fetch(`${config.baseURL}/api/order/status/${idOrderDB}`);
            const data = await response.json();

            if (data.status === ORDER_STATUS.READY) {
                playMusic();
                alert('Makanan Sudah Siap.');
            } else if (data.status === ORDER_STATUS.DONE) {
                handleBackToInitial();
            } else {
                alert('Makanan Belum Siap.');
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            alert('Gagal mengecek status.');
        }
    };

    const handleButtonClick = () => {
        if (isBtnVisible.toBarcode) {
            navigate('/resto/order/barcode', { state: { idOrder } });
        }
    };

    const playMusic = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/notif.mp3');
            audioRef.current.loop = true;
        }
        audioRef.current.play();
    };

    const stopMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        fetchServeType();
        if (!idOrder) return;

        const newSocket = io(`${config.baseURL}`);
        setSocket(newSocket);

        newSocket.on('connect', () => console.log('Socket connected'));

        newSocket.on('order-status-update', (data) => {
            if (String(data.id_order) === String(idOrder)) {
                setStatus(data.status);
            }
        });

        return () => newSocket.disconnect();
    }, [idOrder]);

    useEffect(() => {
        if (status === ORDER_STATUS.READY) {
            playMusic();
        } else if (status === ORDER_STATUS.DONE) {
            handleBackToInitial();
        }
    }, [status]);

    useEffect(() => {
        window.history.replaceState(null, '', window.location.href);
        const handlePopState = () => window.history.replaceState(null, '', window.location.href);

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (!idOrder) checkOrderStatus();
    }, [idOrder]);

    return (
        <div className="waiting-room">
            <h2 className="waiting-header">Waiting</h2>
            <h3 className="order-status">Status Order: {status || 'Loading status...'}</h3>

            {isBtnVisible.status && (
                <button onClick={checkOrderStatus} className="check-button">Cek Status Pembayaran</button>
            )}

            {isBtnVisible.toBarcode && (
                <>
                    <br />
                    <button onClick={handleButtonClick} className="navigate-button">Lanjut Pembayaran</button>
                </>
            )}
        </div>
    );
}

export default WaitingList;
