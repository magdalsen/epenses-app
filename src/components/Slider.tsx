import { RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from "@chakra-ui/react"
import { useUserContext } from "../context/UserContext";

export const Slider = (maxExpense: { value: number; }) => {
    const { setFilter }=useUserContext();    
    return (
        <RangeSlider
        aria-label={['min', 'max']}
        onChangeEnd={(val) => setFilter(val)}
        defaultValue={[0, maxExpense.value]} min={0} max={maxExpense.value} step={30}
        >
        <RangeSliderTrack bg='red.100'>
            <RangeSliderFilledTrack bg='tomato' />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={10} index={0} />
        <RangeSliderThumb boxSize={10} index={1} />
        </RangeSlider>
    )
}
