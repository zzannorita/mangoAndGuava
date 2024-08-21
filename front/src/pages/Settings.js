import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import settingsStyle from "../styles/settings.module.css";
import shopStyle from "../styles/shop.module.css";
import registStyle from "../styles/regist.module.css";
import PostCode from "react-daum-postcode";
import axiosInstance from "../axios";

export default function Settings() {
  /////////////////////////주소등록//////////////////////
  const [zoneCode, setZoneCode] = useState("");
  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZoneCode(zonecode);
    setAddress(address);
    setDetailedAddress("");
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

  ////////////////////주소수정///////////////////
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleDetailedAddressChange = (event) => {
    setDetailedAddress(event.target.value);
  };

  //////////////////닉네임수정///////////////
  const [tempNickName, setTempNickName] = useState("");

  const handleNickNameChange = (event) => {
    setTempNickName(event.target.value);
  };

  /////////////////////계좌수정/////////////////////
  const [tempAccount, setTempAccount] = useState("");
  const [tempBankName, setTempBankName] = useState("");

  const handleAccountChange = (event) => {
    setTempAccount(event.target.value);
  };
  const handleBankNameChange = (event) => {
    setTempBankName(event.target.value);
  };

  useEffect(() => {
    axiosInstance
      .get("/myshop")
      .then((response) => {
        const shopData = response.data;
        const { userData } = shopData;

        const [receivedZoneCode, receivedAddress, receivedDetailedAddress] =
          userData.address.split(",");
        const [receivedBankName, receivedAccountNumber] =
          userData.account.split(",");

        setTempNickName(userData.nickname);
        setZoneCode(receivedZoneCode || "");
        setAddress(receivedAddress || "");
        setDetailedAddress(receivedDetailedAddress || "");
        setTempBankName(receivedBankName || "");
        setTempAccount(receivedAccountNumber || "");
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);

  // 등록 핸들러
  const navigate = useNavigate();
  const handleUpdate = () => {
    const updatedData = {
      nickname: tempNickName,
      address: `${zoneCode},${address},${detailedAddress}`,
      account: `${tempBankName},${tempAccount}`,
    };
    console.log("업데이트 데이터:", updatedData);
    axiosInstance
      .patch("/user-update", updatedData)
      .then((response) => {
        alert("회원정보가 수정되었습니다.");
        navigate("/");
      })
      .catch((error) => {});
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
        <div className={settingsStyle.commonSettingBox}>
          <div className={settingsStyle.settingTitle}>닉네임</div>
          <input
            className={settingsStyle.commonInputBox}
            value={tempNickName}
            onChange={handleNickNameChange}
          />
        </div>
        <div className={settingsStyle.addressBox}>
          <div className={settingsStyle.settingTitle}>주소등록</div>
          <div>
            <div>
              <input
                value={zoneCode}
                className={settingsStyle.addressInputBox}
                readOnly
              />
              <button
                className={settingsStyle.buttonStyle}
                type="button"
                onClick={toggleHandler}
              >
                주소 찾기
              </button>
              {!isOpen && (
                <div>
                  <PostCode
                    onComplete={completeHandler}
                    onClose={closeHandler}
                  />
                </div>
              )}
            </div>
            <div
              className={settingsStyle.commonInputBox}
              onChange={handleAddressChange}
            >
              {address}
            </div>
            <input
              className={settingsStyle.commonInputBox}
              value={detailedAddress}
              onChange={handleDetailedAddressChange}
            />
          </div>
        </div>
        <div className={settingsStyle.commonSettingBox}>
          <div className={settingsStyle.settingTitle}>계좌등록</div>
          <div className={settingsStyle.accountBox}>
            <div className={settingsStyle.accountTitle}>
              <div>은행명</div>
              <input
                className={settingsStyle.addressInputBox}
                value={tempBankName}
                onChange={handleBankNameChange}
              />
            </div>
            <div className={settingsStyle.accountTitle}>
              <div>계좌번호</div>
              <input
                className={settingsStyle.commonInputBox}
                value={tempAccount}
                onChange={handleAccountChange}
              />
            </div>
          </div>
        </div>
        <div className={registStyle.registButtonBox}>
          <button className={registStyle.registButton} onClick={handleUpdate}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
