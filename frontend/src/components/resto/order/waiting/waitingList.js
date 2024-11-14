import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { getOrderId } from '../orderDB'; // Import fungsi baru
import './WaitingList.css'; // Menambahkan file CSS untuk animasi dan style
import { getProfileIdFromCart } from '../cart/cartDB';

function WaitingList() {
    const location = useLocation();
    const navigate = useNavigate(); // Hook untuk navigasi
    const { idOrder } = location.state || {}; // Ambil idOrder dari state
    const [status, setStatus] = useState('');
    const [socket, setSocket] = useState(null);
    const [isBtnStatus, setBtnStatus] = useState(true); // State untuk visibilitas tombol
    const [isBtnToBarcode, setisBtnToBarcode] = useState(false); // State untuk visibilitas tombol

    const ORDER_STATUS = {
        READY: 'ready',
        DONE: 'done',
        PENDING: 'pending',
    };


    const fetchServeType = async () => {
        try {
            const profileId = await getProfileIdFromCart();
            const response = await fetch(`http://localhost:3000/api/settings/profile/${profileId}`);
            const data = await response.json();
            const serveType = data[0]?.serveType;

            if (serveType === 2) {
                setisBtnToBarcode(true);
                setBtnStatus(false);
            } else {
                console.log('Nilai serveType tidak valid:', serveType);
            }
        } catch (error) {
            console.error('Gagal mengambil serveType:', error);
        }
    };

    const handleButtonClick = () => {
        if (isBtnToBarcode) {
            navigate('/resto/order/barcode', { state: { idOrder: idOrder } });
        }
    };

    const checkOrder = async () => {
        try {
            // Ambil id_order dari cart
            const idOrderDB = await getOrderId();

            // Periksa apakah idOrder valid
            if (!idOrderDB) {
                console.error('ID Order tidak ditemukan.');
                return;
            }

            // Lakukan permintaan untuk mengecek status menggunakan idOrder
            const response = await fetch(`http://localhost:3000/api/order/status/${idOrderDB}`);
            const data = await response.json();

            if (data.status === ORDER_STATUS.READY) {
                playMusic();
            } else if (status === ORDER_STATUS.DONE) {
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Error fetching status:', error);
            alert('Gagal mengecek status.');
        }
    };

    useEffect(() => {
        fetchServeType();
        if (!idOrder) return; // Pastikan idOrder ada sebelum mencoba koneksi socket

        const newSocket = io('http://localhost:3000'); // Ganti dengan URL server Anda
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        // Listen for updates from server untuk id_order tertentu
        newSocket.on('order-status-update', (data) => {
            console.log('Received order status update:', data);
            if (String(data.id_order) === String(idOrder)) {
                console.log('Updating status to:', data.status); // Log untuk memeriksa status yang diterima
                setStatus(data.status);

            }
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [idOrder]); // Perubahan pada idOrder akan trigger efek ini lagi

    useEffect(() => {
        if (status === ORDER_STATUS.READY) {

            playMusic(); // Menambahkan pemutaran musik
        } else if (status === ORDER_STATUS.DONE) {
            window.location.href = '/';
        }
    }, [status]);

    // Fungsi untuk memutar musik
    const playMusic = () => {
        const audio = new Audio('/notif.mp3'); // Ganti dengan path musik yang sesuai
        audio.loop = true;
        audio.play();
    };

    // Menghindari kembali ke halaman sebelumnya
    useEffect(() => {
        // Ganti riwayat sehingga tidak ada entri sebelumnya
        window.history.replaceState(null, '', window.location.href);

        const handlePopState = () => {
            // Ketika pengguna mencoba menggunakan tombol "back", kita tetap mengganti riwayat
            window.history.replaceState(null, '', window.location.href);
        };

        // Menambahkan event listener untuk popstate
        window.addEventListener('popstate', handlePopState);

        return () => {
            // Hapus event listener ketika komponen di-unmount
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); // Pastikan effect hanya dijalankan sekali

    const checkStatusManually = async () => {
        try {
            const idOrderDB = await getOrderId();
            const response = await fetch(`http://localhost:3000/api/order/status/${idOrderDB}`);
            const data = await response.json();
            if (data.status === ORDER_STATUS.READY) {
                alert('Makanan Sudah Siap.');
            } else if (data.status === ORDER_STATUS.DONE) {
                window.location.href = '/';
            } else {
                alert('Makanan Belum Siap.');
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            alert('Gagal mengecek status.');
        }
    };

    // Log untuk debugging
    console.log('Current status:', status);

    if (!idOrder) {
        checkOrder(); // Tampilkan loading jika idOrder belum tersedia
    }

    return (
        <div className="waiting-room">
            <h2 className="waiting-header">Waiting</h2>
            <h3 className="order-status">Status Order: {status || 'Loading status...'}</h3>

            {isBtnStatus && (
                <button onClick={checkStatusManually} className="check-button">Cek Status Pembayaran</button>
            )}

            {isBtnToBarcode && (
                <>
                    <br />
                    <button onClick={handleButtonClick} className="navigate-button">Lanjut Pembayaran</button>
                </>
            )}

        </div>
    );
}

export default WaitingList;
