const binarySearch = (arr, n, x, searchFirst) => {
  let low = 0;
  let high = n - 1;
  let result = -1;

  while (low <= high) {
    let mid = (low + high)/2;

    if(arr[mid] === x) {
      result = mid;
      if (searchFirst)
        high = mid - 1;
      else
        low = mid + 1;
    }
    else if(x < arr[mid]) high = mid - 1;
    else low = mid + 1;
  }

  return result;
}

// const sizeOfArr = arr.length;
// const searchFirst = true;
// console.log(binarySearch(arr, sizeOfArr, num, searchFirst));

const findCount = (arr, num) => {
  if (arr.indexOf(num) === -1) return 0;
  
  return (arr.lastIndexOf(num) - arr.indexOf(num) + 1);
};

const arr = [1,1,2,2,3,3,4,4,4];
const num = 1;
const count = findCount(arr, num);
console.log(`Count of ${num} = ${count}`);








