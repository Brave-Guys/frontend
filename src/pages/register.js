import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import FloatingInput from '../components/FloatingInput';
import { registerUser } from '../apis/registerUser';
import { checkNickname, checkUsername } from '../apis/checkDuplicate';
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        emailId: '',
        emailDomain: 'naver.com',
        customEmailDomain: '',
    });
    const [status, setStatus] = useState({});
    const [messages, setMessages] = useState({});
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });
        if (field === 'username') setIsUsernameChecked(false);
        if (field === 'nickname') setIsNicknameChecked(false);
    };

    const handleCheckUsername = async () => {
        if (!formData.username) {
            setStatus((prev) => ({ ...prev, username: 'error' }));
            setMessages((prev) => ({ ...prev, username: '아이디를 입력하세요.' }));
            setIsUsernameChecked(false);
            return;
        }
        try {
            await checkUsername(formData.username);
            setStatus((prev) => ({ ...prev, username: 'success' }));
            setMessages((prev) => ({ ...prev, username: '사용 가능한 아이디입니다.' }));
            setIsUsernameChecked(true);
        } catch (err) {
            setIsUsernameChecked(false);
            setStatus((prev) => ({ ...prev, username: 'error' }));
            setMessages((prev) => ({ ...prev, username: err.response?.status === 409 ? '이미 사용 중인 아이디입니다.' : '아이디 확인 중 오류 발생' }));
        }
    };

    const handleCheckNickname = async () => {
        if (!formData.nickname) {
            setStatus((prev) => ({ ...prev, nickname: 'error' }));
            setMessages((prev) => ({ ...prev, nickname: '닉네임을 입력하세요.' }));
            setIsNicknameChecked(false);
            return;
        }
        try {
            await checkNickname(formData.nickname);
            setStatus((prev) => ({ ...prev, nickname: 'success' }));
            setMessages((prev) => ({ ...prev, nickname: '사용 가능한 닉네임입니다.' }));
            setIsNicknameChecked(true);
        } catch (err) {
            setIsNicknameChecked(false);
            setStatus((prev) => ({ ...prev, nickname: 'error' }));
            setMessages((prev) => ({ ...prev, nickname: err.response?.status === 409 ? '이미 사용 중인 닉네임입니다.' : '닉네임 확인 중 오류 발생' }));
        }
    };

    const handleSubmit = async () => {
        const newStatus = {};
        const newMessages = {};

        if (!/^[\w]{6,20}$/.test(formData.username)) {
            newStatus.username = 'error';
            newMessages.username = '6~20자의 아이디를 입력해주세요.';
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?]).{8,20}$/.test(formData.password)) {
            newStatus.password = 'error';
            newMessages.password = '비밀번호가 짧거나 형식에 맞지 않아요.';
        }
        if (formData.password !== formData.confirmPassword) {
            newStatus.confirmPassword = 'error';
            newMessages.confirmPassword = '비밀번호가 일치하지 않아요.';
        }
        if (!/^.{3,20}$/.test(formData.nickname)) {
            newStatus.nickname = 'error';
            newMessages.nickname = '3~20자의 닉네임을 입력해주세요.';
        }
        if (!/^\S+@\S+\.\S+$/.test(`${formData.emailId}@${formData.emailDomain === 'custom' ? formData.customEmailDomain : formData.emailDomain}`)) {
            newStatus.emailId = 'error';
            newMessages.emailId = '이메일 형식으로 입력해주세요.';
        }

        setStatus(newStatus);
        setMessages(newMessages);

        if (Object.keys(newStatus).length === 0) {
            if (!isUsernameChecked || !isNicknameChecked) {
                alert('아이디 또는 닉네임 중복 확인을 완료해주세요.');
                return;
            }
            try {
                await registerUser(formData);
                navigate('/register-success');
            } catch (err) {
                alert('회원가입 실패: ' + (err.response?.data?.message || '알 수 없는 오류'));
            }
        }
    };

    return (
        <div className='register-container'>
            <PageTitle
                title="회원가입"
                description='꾸준함이 쌓이면, 변화가 시작됩니다.'
                showBackArrow />
            <div style={{ margin: '30px' }}></div>
            <div className='register-form'>
                <div className="input-with-button">
                    <FloatingInput
                        id="username"
                        label="아이디"
                        value={formData.username}
                        onChange={handleChange('username')}
                    />
                    <button className="register-check-button" onClick={handleCheckUsername}>중복 확인</button>
                    {messages.username && <p className={`input-message ${status.username}`}>{messages.username}</p>}
                </div>

                <FloatingInput
                    id="password"
                    label="비밀번호"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                />
                {messages.password && <p className={`input-message ${status.password}`}>{messages.password}</p>}

                <FloatingInput
                    id="confirmPassword"
                    label="비밀번호 확인"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                />
                {messages.confirmPassword && <p className={`input-message ${status.confirmPassword}`}>{messages.confirmPassword}</p>}

                <div className="input-with-button">
                    <FloatingInput
                        id="nickname"
                        label="닉네임"
                        value={formData.nickname}
                        onChange={handleChange('nickname')}
                    />
                    <button className="register-check-button" onClick={handleCheckNickname}>중복 확인</button>
                    {messages.nickname && <p className={`input-message ${status.nickname}`}>{messages.nickname}</p>}
                </div>

                <div className="email-input-row">
                    <FloatingInput
                        id="emailId"
                        label="이메일 아이디"
                        value={formData.emailId}
                        onChange={handleChange('emailId')}
                    />
                    <span className="email-at">@</span>
                    {formData.emailDomain === 'custom' ? (
                        <FloatingInput
                            id="customDomain"
                            label="도메인"
                            value={formData.customEmailDomain || ''}
                            onChange={handleChange('customEmailDomain')}
                        />
                    ) : (
                        <span className="email-domain">{formData.emailDomain}</span>
                    )}
                    <select
                        value={formData.emailDomain}
                        onChange={handleChange('emailDomain')}
                        className="email-select"
                    >
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="nate.com">nate.com</option>
                        <option value="yahoo.com">yahoo.com</option>
                        <option value="hotmail.com">hotmail.com</option>
                        <option value="outlook.com">outlook.com</option>
                        <option value="icloud.com">icloud.com</option>
                        <option value="kakao.com">kakao.com</option>
                        <option value="hanmail.net">hanmail.net</option>
                        <option value="proton.me">proton.me</option>
                        <option value="tistory.com">tistory.com</option>
                        <option value="custom">직접 입력</option>
                    </select>
                    {messages.emailId && <p className={`input-message ${status.emailId}`}>{messages.emailId}</p>}
                </div>

                <div className="submit-button-wrapper">
                    <button className="register-submit-button" onClick={handleSubmit}>회원가입</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
