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

const arr = [1,1,2,2,3,3,4,4,4];
const sizeOfArr = arr.length;
const num = 4;
const searchFirst = true;
console.log(binarySearch(arr, sizeOfArr, num, searchFirst));