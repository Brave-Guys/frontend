import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import CustomButton from '../components/CustomButton';
import { postChallenge } from '../apis/postChallenge';
import { uploadVideoToFirebase } from '../utils/uploadVideoToFirebase';
import '../styles/ChallengeWrite.css';

const ChallengeWrite = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        const now = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(now.getDate() + 7);

        const format = (date) => date.toISOString().split('T')[0];

        setStartDate(format(now));
        setEndDate(format(oneWeekLater));
    }, []);

    const handleSubmit = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!title.trim() || !description.trim()) {
            alert('제목과 설명을 모두 입력해주세요.');
            return;
        }

        try {
            let videoUrl = null;

            if (videoFile) {
                videoUrl = await uploadVideoToFirebase(videoFile);
            }

            const res = await postChallenge({
                writerId: user.id,
                name: title.trim(),
                description: description.trim(),
                videoUrl,
            });

            alert('챌린지 등록 완료!');
            navigate('/challenges');
        } catch (err) {
            console.error('챌린지 등록 실패', err);
            alert('챌린지 등록에 실패했습니다.');
        }
    };

    return (
        <div className="challenge-write-container">
            <PageTitle
                title="챌린지 등록"
                description={"챌린지를 등록해보세요."}
                showBackArrow={true} />

            <div style={{ margin: '30px' }}></div>

            <div className="challenge-form">
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="challenge-input"
                />

                <textarea
                    placeholder="챌린지 설명을 입력하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="challenge-textarea"
                />

                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="challenge-video-input"
                />

                <div className="challenge-date-display">
                    기간: {startDate} ~ {endDate}
                </div>

                <div className="challenge-submit-row">
                    <CustomButton
                        label="등록"
                        size="large"
                        color="purple"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChallengeWrite;
