import { useRecoilState } from "recoil";
import { typeState } from "../utils/recoil/atoms";

export default function useType() {
    const [selectedType, setSelectedType] = useRecoilState(typeState);

    const toggleType = (type: { code: string; codeName: string }) => {
        setSelectedType((prev) => (prev?.code === type.code ? prev : type));
    };

    return { selectedType, toggleType };
}
