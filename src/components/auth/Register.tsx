import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ko} from "date-fns/locale";
import {EmailDupChk, IdDupChk, NicknameDupChk, PhoneNumberDupChk, UserRegiste} from "../../services/auth/AuthService";
import SelectBox from "../common/SelectBox";
import useForm from "../../hooks/useForm";
import useErrors from "../../hooks/useErrors";
import Button from "../common/Button";
import Input from "../common/Input";


// 한국어 로케일 등록
registerLocale("ko", ko);

type FormType = {
    userTp: string;
    username: string;
    email: string;
    phoneNumber: string;
    nickname: string;
    id: string;
    password: string;
    passwordChk: string;
    birthDate: string;
    agreeYn: string;
}

export default function Register({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const formState = useForm({
            userTp: "",
            username: "",
            email: "",
            phoneNumber: "",
            nickname: "",
            id: "",
            password: "",
            passwordChk: "",
            birthDate: "",
            agreeYn: "Y",
    });
    const errorState = useErrors({
        userTp: "",
        username: "",
        email: "",
        phoneNumber: "",
        nickname: "",
        id: "",
        password: "",
        passwordChk: "",
        birthDate: "",
        idDupChkYn: "",
        nicknameDupChkYn: "",
    });

    const [dupSuccessMessage, setDupSuccessMessage] = useState({
        id: "",
        nickname: "",
    });
    const [dupErrorMessage,setDupErrorMessage] = useState({
        id: "",
        nickname: "",
    });

    const [dupChkYn, setDupChkYn] = useState({
        id: "N",
        nickname: "N",
        email:"N",
        phoneNumber:"N"
    });

    const validate = () => {
        // 회원구분
        if(formState.values.userTp == '') {
            console.log(formState.values);
            errorState.setError("userTp", "회원구분은 필수 입력 값입니다.");
        }

        // 닉네임
        if(formState.values.nickname == '') {
            errorState.setError("nickname", "닉네임은 필수 입력 값입니다.");
        }
        // 성명
        if(formState.values.username == '') {
            errorState.setError("username", "성명은 필수 입력 값입니다.");
        }

        // 생년월일
        if(formState.values.birthDate == '') {
            errorState.setError("birthDate", "생년월일은 필수 입력 값입니다.");
        }

        // 아이디
        if(formState.values.id == '') {
            errorState.setError("id", "아이디는 필수 입력 값입니다.");
        }

        if(formState.values.password == '') {
            errorState.setError("password", "비밀번호는 필수 입력 값입니다.");
        } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/.test(formState.values.password)) {
            errorState.setError("password", "비밀번호는 영문 대,소문자와 숫자, 특수기호가 포함된 8자 ~ 20자여야 합니다.");
        }

        if(formState.values.password !== formState.values.passwordChk) {
            errorState.setError("passwordChk", "비밀번호가 일치하지 않습니다.");
        }

        // 이메일
        if(formState.values.email == '') {
            errorState.setError("email", "이메일 필수 입력 값입니다.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.values.email)) {
            console.log(formState.values.email);
            errorState.setError("email", "이메일 형식에 맞지 않습니다.");
        }

        // 아이디 중복확인 여부
        if(dupChkYn.id != 'Y') {
            errorState.setError("idDupChkYn", "아이디 중복확인을 해주세요.");
        }

        //닉네임 중복확인 여부
        if(dupChkYn.nickname != 'Y') {
            errorState.setError("nicknameDupChkYn", "닉네임 중복확인을 해주세요.");
        }

        return Object.values(errorState.errors).every((error) => error === "");
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if(name === 'passwordChk') {
            if(formState.values.password === e.target.value) {
                errorState.setError("passwordChk", '');
            } else {
                errorState.setError("passwordChk", '비밀번호가 일치하지 않습니다.');
            }

            formState.handleChange({
                target: {
                    name: "passwordChk",
                    value: value,
                    type: "text",
                },
            } as React.ChangeEvent<HTMLInputElement>);
        }

        if(name === 'phoneNumber') {
            let inputPhoneNumber = e.target.value.replace(/[^0-9-]/g, ""); // 숫자와 하이픈만 허용
            // 하이픈 자동 추가 (XXX-XXXX-XXXX 형식)
            inputPhoneNumber = inputPhoneNumber
                .replace(/-/g, "") // 기존 하이픈 제거
                .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
                .substring(0, 13); // 최대 13자까지만

            formState.handleChange({
                target: {
                    name: "phoneNumber",
                    value: inputPhoneNumber,
                    type: "text",
                },
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // 로컬 시간 변환

            formState.handleChange({
                target: {
                    name: "birthDate",
                    value: localDate.toISOString(), // 문자열로 변환하여 저장
                    type: "text" // `Date` 타입이 아닌 `text`로 처리
                }
            } as React.ChangeEvent<HTMLInputElement>); // 타입 단언
        }
    };

    const handelIdDupChk = async ()=> {
        const userId = formState.values.id;
        if(!userId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await IdDupChk(userId);

            if(!response) {
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
        const nickname = formState.values.nickname;
        if(!nickname) {
            alert("닉네임 입력해주세요.");
            return;
        }

        try {
            const response =  await NicknameDupChk(nickname);

            if(!response) {
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

    const handelEmailDupChk = async ()=> {
        const email = formState.values.email;

        try {
            const response = await EmailDupChk(email);

            if(!response) {
                setDupChkYn((prev) =>  ({
                    ...prev,
                    email: 'Y',
                }));
            }
        } catch (error) {
            alert('중복체크에 실패 했습니다. 관리자에게 문의하세요.');
        }
    };

    const handelPhoneNumberDupChk = async ()=> {
        const phoneNumber = formState.values.phoneNumber;

        try {
            const response =  await PhoneNumberDupChk(phoneNumber);

            if(!response) {
                setDupChkYn((prev) =>  ({
                    ...prev,
                    phoneNumber: 'Y',
                }));
            }
        } catch (error) {
            alert('중복체크에 실패 했습니다. 관리자에게 문의하세요.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handelEmailDupChk();
        handelPhoneNumberDupChk();


        if (validate()) {
            // 서버로 데이터 전송
            const response = await UserRegiste(formState.values as FormType);
            const [accessToken, refreshToken] = response;


            if(response) {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                setIsLoggedIn(refreshToken);

                alert('회원가입이 완료되었습니다.');
                navigate('/');
            }

        } else if (dupChkYn.id === 'N') {
            alert("아이디 중복확인을 해주세요.");
            return;
        } else if (dupChkYn.nickname === 'N') {
            alert("닉네임 중복확인을 해주세요.");
            return;
        } else if (dupChkYn.phoneNumber === 'Y') {
            alert("이미 등록된 휴대전화번호 입니다.");
            return;
        } else if (dupChkYn.email === 'Y') {
            alert("이미 등록된 이메일 입니다.");
            return;
        } else {
            alert("입력값을 확인해주세요.");
            return;
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">HEALTH 회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/** 성명 */}
                <div>
                    <label htmlFor="username" className="block font-medium text-gray-700">
                        성명
                    </label>
                    <Input
                        type={"text"}
                        id={"username"}
                        name={"username"}
                        value={formState.values.username}
                        onChange={formState.handleChange}
                        className={"input-text"}
                    />
                    {errorState.errors.username && <p className="text-red-500 text-sm">{errorState.errors.username}</p>}
                </div>

                {/** 생년월일 */}
                <div>
                    <label htmlFor="birthDate" className="block font-medium text-gray-700">
                        생년월일
                    </label>
                    <DatePicker
                        selected={formState.values.birthDate ? new Date(formState.values.birthDate) : null}
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
                    {errorState.errors.birthDate && <p className="text-red-500 text-sm">{errorState.errors.birthDate}</p>}
                </div>

                {/** 휴대전화번호 */}
                <div>
                    <label htmlFor="phoneNumber" className="block font-medium text-gray-700">
                        휴대전화번호
                    </label>
                    <Input
                        type={"text"}
                        id={"phoneNumber"}
                        name={"phoneNumber"}
                        value={formState.values.phoneNumber}
                        onChange={handleChange}
                        className={"input-text"}
                        maxLength={13}
                    />
                    {errorState.errors.phoneNumber && <p className="text-red-500 text-sm">{errorState.errors.phoneNumber}</p>}
                </div>

                {/** 이메일 */}
                <div>
                    <label htmlFor="email" className="block font-medium text-gray-700">
                        이메일
                    </label>
                    <Input
                        type={"email"}
                        id={"email"}
                        name={"email"}
                        value={formState.values.email}
                        onChange={formState.handleChange}
                        className={"input-text"}
                    />
                    {errorState.errors.email && <p className="text-red-500 text-sm">{errorState.errors.email}</p>}
                </div>

                {/** 회원구분 */}
                <div>
                    <label htmlFor="userTp" className="block font-medium text-gray-700">
                        회원구분
                    </label>
                    <SelectBox code={"001"} val={formState.values.userTp} changeId={"userTp"} changeState={formState.handleChange}/>
                    {errorState.errors.userTp && <p className="text-red-500 text-sm">{errorState.errors.userTp}</p>}
                </div>

                {/** 닉네임 */}
                <div>
                    <label htmlFor="nickname" className="block font-medium text-gray-700">
                        닉네임
                    </label>
                    <div className="flex justify-between">
                        <Input
                            type={"text"}
                            id={"nickname"}
                            name={"nickname"}
                            value={formState.values.nickname}
                            onChange={formState.handleChange}
                            className={"input-text-flex"}
                            maxLength={10}
                        />

                        <Button type={"button"} className="confirm-btn" onClick={handelNicknameDupChk} label={"중복확인"}/>
                    </div>
                    {dupSuccessMessage.nickname && <p className="text-blue-500 text-sm">{dupSuccessMessage.nickname}</p>}
                    {dupErrorMessage.nickname && <p className="text-red-500 text-sm">{dupErrorMessage.nickname}</p>}
                    {errorState.errors.nickname && <p className="text-red-500 text-sm">{errorState.errors.nickname}</p>}
                </div>


                {/** 아이디 */}
                <div>
                    <label htmlFor="id" className="block font-medium text-gray-700">
                        아이디
                    </label>
                    <div className="flex justify-between">
                        <Input
                            type={"text"}
                            id={"id"}
                            name={"id"}
                            value={formState.values.id}
                            onChange={formState.handleChange}
                            className={"input-text-flex"}
                            maxLength={10}
                            placeholder={'아이디'}
                        />
                        <Button type={"button"} className="confirm-btn" onClick={handelIdDupChk} label={"중복확인"}/>
                    </div>
                    {dupSuccessMessage.id && <p className="text-blue-500 text-sm">{dupSuccessMessage.id}</p>}
                    {dupErrorMessage.id && <p className="text-red-500 text-sm">{dupErrorMessage.id}</p>}
                    {errorState.errors.id && <p className="text-red-500 text-sm">{errorState.errors.id}</p>}
                </div>

                {/** 비밀번호 */}
                <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">
                        비밀번호
                    </label>
                    <Input
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        value={formState.values.password}
                        onChange={formState.handleChange}
                        className={"input-text"}
                        maxLength={20}
                    />
                    {errorState.errors.password && <p className="text-red-500 text-sm">{errorState.errors.password}</p>}
                </div>

                {/** 비밀번호 확인*/}
                <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">
                        비밀번호 확인
                    </label>
                    <Input
                        type={"password"}
                        id={"passwordChk"}
                        name={"passwordChk"}
                        value={formState.values.passwordChk}
                        onChange={handleChange}
                        className={"input-text"}
                        maxLength={20}
                    />
                    {errorState.errors.passwordChk && <p className="text-red-500 text-sm">{errorState.errors.passwordChk}</p>}
                </div>


                {/** 제출 버튼 */}
                <Button type={"submit"} className="apply-btn" label={"회원가입"}/>
            </form>
        </div>
    );
}