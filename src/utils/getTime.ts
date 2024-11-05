export const calculateTimeDifference = (dateString: string) => {
  const postTimeUTC = new Date(dateString);
  
  const currentTimeUTC = new Date();

  const postTime = new Date(postTimeUTC.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 giờ

  const differenceInMilliseconds = currentTimeUTC.getTime() - postTime.getTime();
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  if (differenceInMinutes < 1) {
    return 'Just now';
  } else if (differenceInMinutes < 60) {
    return `${Math.floor(differenceInMinutes)} minutes ago`;
  } else if (differenceInHours < 24) {
    return `${Math.floor(differenceInHours)} hours ago`;
  } else {
    return `${Math.floor(differenceInDays)} days ago`;
  }
};

// Ví dụ sử dụng
const dateString = "2024-11-05T12:38:25.253Z"; // Thời gian đăng
console.log(calculateTimeDifference(dateString)); // Kiểm tra kết quả
