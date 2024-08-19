import React, { useState } from "react";
import settingsStyle from "../styles/settings.module.css";
import shopStyle from "../styles/shop.module.css";
import PostCode from "react-daum-postcode";
import editImg from "../image/edit.png";
import checkImg from "../image/checkbox.png";

export default function Settings() {
  /////////////////////////주소등록//////////////////////
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState("false");
  const [detailedAddress, setDetailedAddress] = useState("");

  const completeHandler = (data) => {
    console.log(data);
    const { address, zonecode } = data;
    setZonecode(zonecode);
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

  //////////////////닉네임수정///////////////
  const [nickName, setNickName] = useState("");
  const [editNickName, setEditNickName] = useState(false);
  const [nickNameDescription, setNickNameDescription] = useState("");
  const [tempNickName, setTempNickName] = useState("");

  const handleEditNickName = () => {
    if (editNickName) {
      setNickNameDescription(tempNickName);
    } else {
      setNickNameDescription(nickNameDescription);
    }
    setEditNickName(!editNickName);
  };

  const handleNickNameChange = (event) => {
    setTempNickName(event.target.value);
  };

  ////////////////////주소수정///////////////////
  const [editAddress, setEditAddress] = useState(false);
  const [addressDescription, setAddressDescription] = useState("");
  const [tempAddress, setTempAddress] = useState("");

  const handleEditAddress = () => {
    if (editAddress) {
      setAddressDescription(tempAddress);
    } else {
      setAddressDescription(addressDescription);
    }
    setEditAddress(!editAddress);
  };

  const handleAddressChange = (event) => {
    setTempAddress(event.target.value);
  };

  /////////////////////계좌수정/////////////////////
  const [editAccount, setEditAccount] = useState(false);
  const [accountDescription, setAccountDescription] = useState("");
  const [tempAccount, setTempAccount] = useState("");

  const handleEditAccount = () => {
    if (editAccount) {
      setAccountDescription(tempAccount);
    } else {
      setAccountDescription(accountDescription);
    }
    setEditAccount(!editAccount);
  };

  const handleAccountChange = (event) => {
    setTempAccount(event.target.value);
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
            value={editNickName ? tempNickName : nickNameDescription}
            onChange={handleNickNameChange}
            disabled={!editNickName}
          />
          {editNickName ? (
            <img
              className={settingsStyle.editImg}
              src={checkImg}
              alt="checkImg"
              onClick={handleEditNickName}
            ></img>
          ) : (
            <img
              className={settingsStyle.editImg}
              src={editImg}
              alt="editImg"
              onClick={handleEditNickName}
            ></img>
          )}
        </div>
        <div className={settingsStyle.addressBox}>
          <div className={settingsStyle.settingTitle}>주소등록</div>
          <div>
            <div>
              <input
                value={zonecode}
                className={settingsStyle.addressInputBox}
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
                    className={settingsStyle.nickNameInputBox}
                    onComplete={completeHandler}
                    onClose={closeHandler}
                  />
                </div>
              )}
            </div>

            <div>{address}</div>
            <input
              className={settingsStyle.commonInputBox}
              value={editAddress ? tempAddress : addressDescription}
              onChange={handleAddressChange}
              disabled={!editAddress}
            />
            {editAddress ? (
              <img
                className={settingsStyle.editImg}
                src={checkImg}
                alt="checkImg"
                onClick={handleEditAddress}
              ></img>
            ) : (
              <img
                className={settingsStyle.editImg}
                src={editImg}
                alt="editImg"
                onClick={handleEditAddress}
              ></img>
            )}
          </div>
        </div>
        <div className={settingsStyle.commonSettingBox}>
          <div className={settingsStyle.settingTitle}>계좌등록</div>
          <div className={settingsStyle.accountBox}>
            <div className={settingsStyle.accountTitle}>
              <div>은행명</div>
              <input
                className={settingsStyle.addressInputBox}
                onChange={handleAccountChange}
                disabled={!editAccount}
              />
            </div>
            <div className={settingsStyle.accountTitle}>
              <div>계좌번호</div>
              <input
                className={settingsStyle.commonInputBox}
                onChange={handleAccountChange}
                disabled={!editAccount}
              />
              {editAccount ? (
                <img
                  className={settingsStyle.editImg}
                  src={checkImg}
                  alt="checkImg"
                  onClick={handleEditAccount}
                ></img>
              ) : (
                <img
                  className={settingsStyle.editImg}
                  src={editImg}
                  alt="editImg"
                  onClick={handleEditAccount}
                ></img>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
