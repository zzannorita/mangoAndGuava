const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { name: "년", value: 60 * 60 * 24 * 365 },
    { name: "개월", value: 60 * 60 * 24 * 30 },
    { name: "일", value: 60 * 60 * 24 },
    { name: "시간", value: 60 * 60 },
    { name: "분", value: 60 },
    { name: "초", value: 1 },
  ];

  for (const interval of intervals) {
    const amount = Math.floor(seconds / interval.value);
    if (amount >= 1) {
      return `${amount} ${interval.name}전`;
    }
  }

  return "방금"; // 1초 이하의 경우
};

export default getRelativeTime;
