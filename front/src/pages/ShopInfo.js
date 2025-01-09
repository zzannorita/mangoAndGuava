import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../axios";
import shopStyle from "../styles/shop.module.css";
import userImage from "../image/userImg.png";
import editImg from "../image/edit.png";
import checkImg from "../image/checkbox.png";
import RatingAvg from "../components/RatingAvg";
export default function ShopInfo() {
  useEffect(() => {
    axiosInstance
      .get("/myShop")
      .then((response) => {
        const data = response.data;
        const userData = data.userData;
        const shopInfo = data.shopData[0]?.shopInfo || "";
        setCommentCount(data.commentCount?.ratingAvg || 0);
        setUserData(userData || { address: "주소 없음" });
        setUserExImg(userData?.profileImage || userImage);
        setShopData(data.shopData[0]);
        setDescription(shopInfo);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);

  /////////////////////소개글 수정//////////////////////
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [shopData, setShopData] = useState({
    userId: "",
    shopRating: 0,
    shopInfo: "",
  });
  const [commentCount, setCommentCount] = useState("");
  const handleEditClick = () => {
    if (isEditing) {
      axiosInstance
        .patch("/update-info", { shopInfo: description })
        .then(() => {
          setShopData((prevShopData) => ({
            ...prevShopData,
            shopInfo: description,
          }));
          alert("수정이 완료되었습니다.");
        })
        .catch((error) => console.error("설명 업데이트 실패", error));
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  ////////////////////이미지 업로드//////////////////
  const [userImg, setUserImg] = useState("");
  const [userExImg, setUserExImg] = useState("");
  const imageUploadHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImg(imageUrl);

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await axiosInstance.patch("/profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        if (response.status === 200) {
          setUserImg(response.data.imageUrl);
          alert("이미지가 성공적으로 업로드되었습니다.");
        } else {
          alert("이미지 업로드 실패. 다시 시도해 주세요.");
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <div className={shopStyle.myShopBoxInner}>
        <div className={shopStyle.myShopTitleBox}>
          <div className={shopStyle.myShopTitleText}>
            <span className="impact3">{userData?.nickname}</span>님의 상점
          </div>
          <RatingAvg rating={commentCount} />
        </div>
      </div>
      <div className={shopStyle.myShopInfoBox}>
        <img
          className={shopStyle.myShopImg}
          src={userImg || userExImg}
          alt="userImg"
          onClick={() => document.getElementById("imageInput").click()}
        />
        <input
          id="imageInput"
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={imageUploadHandler}
        />
        <div className={shopStyle.myShopInfoText}>
          <textarea
            className={`${shopStyle.textArea} ${
              isEditing ? shopStyle.textAreaEditing : ""
            }`}
            value={description}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="상점을 소개하는 글을 작성하여 신뢰도를 높여 보세요."
          ></textarea>
        </div>
        <img
          className={shopStyle.editImg}
          src={isEditing ? checkImg : editImg}
          alt={isEditing ? "저장" : "편집"}
          onClick={handleEditClick}
        />
      </div>
    </div>
  );
}
