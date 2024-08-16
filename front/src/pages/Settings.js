import React, { useState } from "react";
import settingsStyle from "../styles/settings.module.css";
import shopStyle from "../styles/shop.module.css";
import PostCode from "react-daum-postcode";

export default function Settings() {
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState("false");
  const [detailedAddress, setDetailedAddress] = useState("");

  const completeHandler = (data) => {
    const { address, zipCode } = data;
    setZipCode(zipCode);
    setAddress(address);
  };

  const closeHandler = (state) => {
    if (state === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (state === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  const toggleHandler = () => {
    setIsOpen((prevOpenState) => !prevOpenState);
  };

  const inputChangeHandler = (event) => {
    setDetailedAddress(event.target.value);
  };

  return (
    <div className={settingsStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>설정</div>
          </div>
        </div>
      </div>
      <div className={settingsStyle.mainContainer}>
        <div className={settingsStyle.nickNameBox}>
          <div>닉네임</div>
          {/* <input className={settingsStyle.nickNameInputBox}>ㅇㅇ</input> */}
        </div>
        <div className={settingsStyle.addressBox}>
          <div>주소등록</div>
          <div>
            <div>
              <div>{zipCode}</div>
              <button type="button" onClick={toggleHandler}>
                주소 찾기
              </button>
            </div>
            {!isOpen && (
              <div>
                <PostCode
                  className={settingsStyle.postCode}
                  onComplete={completeHandler}
                  onClose={closeHandler}
                />
              </div>
            )}
            <div>{address}</div>
            <input value={detailedAddress} onChange={inputChangeHandler} />
          </div>
        </div>
        <div className={settingsStyle.accountBox}>계좌등록</div>
      </div>
    </div>
  );
}
