import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';


type Agreements = {
    termsOfService: boolean;
    privacyPolicy: boolean;
};

export default function Agreement() {
    const navigate = useNavigate();
    const [agreements, setAgreements] = useState({
        termsOfService: false, // 이용 약관
        privacyPolicy: false,  // 개인정보 처리 방침
    });

    const [allChecked, setAllChecked] = useState(false);

    // 필수 약관
    const requiredAgreements:(keyof Agreements)[] = ["termsOfService", "privacyPolicy"];

    const handleCheckboxChange = (key: keyof Agreements) => {
        setAgreements((prev) => {
            const updated = { ...prev, [key]: !prev[key] };

            // 모든 약관이 체크되었는지 확인
            const allRequiredChecked = requiredAgreements.every((req) => updated[req as keyof Agreements]);
            setAllChecked(allRequiredChecked);

            return updated;
        });
    };

    const handleAllCheckboxChange = () => {
        const newState = !allChecked;
        const updatedAgreements: Agreements = Object.keys(agreements).reduce(
            (acc, key) => {
                acc[key as keyof Agreements] = newState; // `key`를 `keyof Agreements`로 타입 캐스팅
                return acc;
            },
            {} as Agreements
        );
        setAgreements(updatedAgreements);
        setAllChecked(newState);
    };

    const handleSubmit = () => {
        if (requiredAgreements.every((key) => agreements[key])) {
            alert("모든 필수 약관에 동의하셨습니다. 다음 단계로 이동합니다.");
            navigate('/register')
        } else {
            alert("필수 약관에 모두 동의해주세요.");
        }
    };

    return (
        <div className="flex flex-col h-full max-w-md items-center justify-center mx-auto my-auto ">
            <div className="border rounded w-full shadow-md p-10">
                <h2 className="text-lg font-bold mb-4 text-center">회원가입 약관 동의</h2>

                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={handleAllCheckboxChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>모두 동의합니다</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={agreements.termsOfService}
                            onChange={() => handleCheckboxChange("termsOfService")}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>[필수] 이용 약관 동의</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={agreements.privacyPolicy}
                            onChange={() => handleCheckboxChange("privacyPolicy")}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>[필수] 개인정보 처리 방침 동의</span>
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                >
                    다음 단계로
                </button>
            </div>
        </div>
    );
}