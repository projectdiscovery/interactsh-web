import React from 'react'
import './styles.scss'

interface ToggleBtnP { name: string, onChangeHandler: any, value: boolean }
const ToggleBtn = ({ name, onChangeHandler, value }: ToggleBtnP) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="switch">
        <input name={name} type="checkbox" checked={value} onChange={onChangeHandler} />
        <span className="slider round" />
    </label>
)

export default ToggleBtn;