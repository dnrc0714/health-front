import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ko} from "date-fns/locale";


// 한국어 로케일 등록
registerLocale("ko", ko);
export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userTp: "",
        username: "",
        email: "",
        phoneNumber: "",
        nickname: "",
        id: "",
        password: "",
        passwordChk: "",
        birthDate: null as Date | null,
        agreeYn: "Y",
    });

    const [errors, setErrors] = useState({
        userTp: "",
        username: "",
        email: "",
        phoneNumber: "",
        nickname: "",
        id: "",
        password: "",
        passwordChk: "",
        idDupChkYn: "",
        nicknameDupChkYn: "",
        birthDate: "",
    });

    const [dupSuccessMessage, setDupSuccessMessage] = useState({
        id: "",
        nickname: ""
    });
    const [dupErrorMessage,setDupErrorMessage] = useState({
        id: "",
        nickname: ""
    });

    const [dupChkYn, setDupChkYn] = useState({
        id: "N",
        nickname: "N"
    });

    const validate = () => {
        const newErrors = { ...errors };

        // 회원구분
        newErrors.userTp = formData.userTp ? "" : "회원구분은 필수 입력 값입니다.";

        // 닉네임
        newErrors.nickname = formData.nickname ? "" : "닉네임은 필수 입력 값입니다.";

        // 성명
        newErrors.username = formData.username ? "" : "성명은 필수 입력 값입니다.";

        // 생년월일
        newErrors.birthDate = formData.birthDate ? "" : "생년월일은 필수 입력 값입니다.";

        // 아이디
        newErrors.id = formData.id ? "" : "아이디는 필수 입력 값입니다.";

        // 비밀번호
        newErrors.password = formData.password
            ? /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/.test(formData.password)
                ? ""
                : "비밀번호는 영문 대,소문자와 숫자, 특수기호가 포함된 8자 ~ 20자여야 합니다."
            : "비밀번호는 필수 입력 값입니다.";

        newErrors.passwordChk = formData.password === formData.passwordChk ? "" : "비밀번호가 일치하지 않습니다."
        // 이메일
        newErrors.email = formData.email
            ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                ? ""
                : "이메일 형식에 맞지 않습니다."
            : "이메일은 필수 입력 값입니다.";

        // 아이디 중복확인 여부
        newErrors.idDupChkYn = dupChkYn.id === 'Y' ? "" : "아이디 중복확인을 해주세요."

        //닉네임 중복확인 여부
        newErrors.nicknameDupChkYn = dupChkYn.nickname === 'Y' ? "" : "닉네임 중복확인을 해주세요."

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if(name === 'passwordChk') {
            if(formData.password === e.target.value) {
                errors.passwordChk = '';
            } else {
                errors.passwordChk = '비밀번호가 일치하지 않습니다.';
            }
        }

        if(name === 'phoneNumber') {
            let inputPhoneNumber = e.target.value.replace(/[^0-9-]/g, ""); // 숫자와 하이픈만 허용
            // 하이픈 자동 추가 (XXX-XXXX-XXXX 형식)
            inputPhoneNumber = inputPhoneNumber
                .replace(/-/g, "") // 기존 하이픈 제거
                .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
                .substring(0, 13); // 최대 13자까지만

            setFormData((prev) =>  ({
                ...prev,
                phoneNumber: inputPhoneNumber,
            }));
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // 로컬 시간대의 날짜 객체로 변환

            setFormData((prev) => ({
                ...prev,
                birthDate: localDate
            }));
        }
    };

    const handelIdDupChk = async ()=> {
        const userId = formData.id;
        if(!userId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('/auth/idDupChk', null, { params: { userId } });

            if(!response.data) {
                setDupSuccessMessage((prev) =>  ({
                    ...prev,
                    id: '사용 가능한 아이디 입니다.',
                }));
                setDupErrorMessage((prev) =>  ({
                    ...prev,
                    id: '',
                }));

                setDupChkYn((prev) =>  ({
                    ...prev,
                    id: 'Y',
                }));
            } else {
                setDupErrorMessage((prev) =>  ({
                    ...prev,
                    id: '이미 사용중인 아이디 입니다.',
                }));
                setDupSuccessMessage((prev) =>  ({
                    ...prev,
                    id: '',
                }));

                setDupChkYn((prev) =>  ({
                    ...prev,
                    id: 'N',
                }));
            }
        } catch (error) {
            alert('중복체크에 실패 했습니다. 관리자에게 문의하세요.');
        }
    };

    const handelNicknameDupChk = async ()=> {
        const nickname = formData.nickname;
        if(!nickname) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('/auth/nicknameDupChk', null, { params: { nickname } });

            if(!response.data) {
                setDupSuccessMessage((prev) =>  ({
                    ...prev,
                    nickname: '사용 가능한 닉네임 입니다.',
                }));
                setDupErrorMessage((prev) =>  ({
                    ...prev,
                    nickname: '',
                }));

                setDupChkYn((prev) =>  ({
                    ...prev,
                    nickname: 'Y',
                }));
            } else {
                setDupErrorMessage((prev) =>  ({
                    ...prev,
                    nickname: '이미 사용중인 닉네임 입니다.',
                }));
                setDupSuccessMessage((prev) =>  ({
                    ...prev,
                    nickname: '',
                }));

                setDupChkYn((prev) =>  ({
                    ...prev,
                    nickname: 'N',
                }));
            }
        } catch (error) {
            alert('중복체크에 실패 했습니다. 관리자에게 문의하세요.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (validate()) {
            // 서버로 데이터 전송
            const response = await axios.post('/auth/register', formData);
            if(response) {
                alert("회원가입 성공!");
                navigate('/');
            }
        } else if (dupChkYn.id === 'N') {
            alert("아이디 중복확인을 해주세요.");
            return;
        } else if (dupChkYn.nickname === 'N') {
            alert("닉네임 중복확인을 해주세요.");
            return;
        } else {
            alert("입력값을 확인해주세요.");
            return;
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4 text-center">HEALTH 회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/** 성명 */}
                <div>
                    <label htmlFor="username" className="block font-medium text-gray-700">
                        성명
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/** 생년월일 */}
                <div>
                    <label htmlFor="birthDate" className="block font-medium text-gray-700">
                        생년월일
                    </label>
                    <DatePicker
                        selected={formData.birthDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()} // 오늘 이전 날짜만 선택 가능
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        placeholderText="생년월일을 선택하세요"
                        locale="ko"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
                </div>

                {/** 휴대전화번호 */}
                <div>
                    <label htmlFor="phoneNumber" className="block font-medium text-gray-700">
                        휴대전화번호
                    </label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                        maxLength={13}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>

                {/** 이메일 */}
                <div>
                    <label htmlFor="email" className="block font-medium text-gray-700">
                        이메일
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/** 회원구분 */}
                <div>
                    <label htmlFor="userTp" className="block font-medium text-gray-700">
                        회원구분
                    </label>
                    <select
                        id="userTp"
                        name="userTp"
                        value={formData.userTp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="">회원구분을 선택해주세요</option>
                        <option value="1">일반인</option>
                        <option value="2">트레이너</option>
                        <option value="3">선수</option>
                    </select>
                    {errors.userTp && <p className="text-red-500 text-sm">{errors.userTp}</p>}
                </div>

                {/** 닉네임 */}
                <div>
                    <label htmlFor="nickname" className="block font-medium text-gray-700">
                        닉네임
                    </label>
                    <div className="flex justify-between">
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            maxLength={15}
                            onChange={handleChange}
                            className="w-3/4 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button"
                                onClick={handelNicknameDupChk}
                                className="text-white bg-green-500 text-md p-3 rounded-xl"
                        >
                            중복확인
                        </button>
                    </div>
                    {dupSuccessMessage.nickname && <p className="text-blue-500 text-sm">{dupSuccessMessage.nickname}</p>}
                    {dupErrorMessage.nickname && <p className="text-red-500 text-sm">{dupErrorMessage.nickname}</p>}
                    {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname}</p>}
                </div>


                {/** 아이디 */}
                <div>
                    <label htmlFor="id" className="block font-medium text-gray-700">
                        아이디
                    </label>
                    <div className="flex justify-between">
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            maxLength={15}
                            onChange={handleChange}
                            className="w-3/4 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button"
                                onClick={handelIdDupChk}
                                className="text-white bg-green-500 text-md p-3 rounded-xl"
                        >
                            중복확인
                        </button>
                    </div>
                    {dupSuccessMessage.id && <p className="text-blue-500 text-sm">{dupSuccessMessage.id}</p>}
                    {dupErrorMessage.id && <p className="text-red-500 text-sm">{dupErrorMessage.id}</p>}
                    {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
                </div>

                {/** 비밀번호 */}
                <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        maxLength={20}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/** 비밀번호 확인*/}
                <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">
                        비밀번호 확인
                    </label>
                    <input
                        type="password"
                        id="passwordChk"
                        name="passwordChk"
                        value={formData.passwordChk}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.passwordChk && <p className="text-red-500 text-sm">{errors.passwordChk}</p>}
                </div>


                {/** 제출 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    회원가입
                </button>
            </form>
        </div>
    );
}