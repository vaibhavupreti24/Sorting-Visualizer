let array = [];
let speed = 50;
const arrayContainer = document.getElementById('array-container');
const buttons = document.querySelectorAll('button');
const sizeSlider = document.getElementById('size');
const speedSlider = document.getElementById('speed');

function generateArray(size = 50) {
    array = [];
    arrayContainer.innerHTML = '';
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}%`;
        bar.dataset.index = index;
        arrayContainer.appendChild(bar);
    });
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    renderArray();
}

function updateArraySize(size) {
    generateArray(size);
}

function updateSpeed(newSpeed) {
    speed = 101 - newSpeed;
}

function disableControls() {
    buttons.forEach(button => button.disabled = true);
    sizeSlider.disabled = true;
}

function enableControls() {
    buttons.forEach(button => button.disabled = false);
    sizeSlider.disabled = false;
}

function markAsSorted(index) {
    const bar = document.querySelector(`.array-bar[data-index="${index}"]`);
    bar.classList.add('sorted');
}

function markAsSorting(index) {
    const bar = document.querySelector(`.array-bar[data-index="${index}"]`);
    bar.classList.add('sorting');
}

function unmark(index) {
    const bar = document.querySelector(`.array-bar[data-index="${index}"]`);
    bar.classList.remove('sorting');
}

async function bubbleSort() {
    disableControls();
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                await sleep(speed);
            }
        }
        markAsSorted(array.length - i - 1);
        await sleep(speed);
    }
    await finalizeSorting();
    enableControls();
}

async function selectionSort() {
    disableControls();
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swap(array, i, minIndex);
            await sleep(speed);
        }
        markAsSorted(i);
        await sleep(speed);
    }
    await finalizeSorting();
    enableControls();
}

async function insertionSort() {
    disableControls();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        markAsSorting(i);
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
            renderArray();
            await sleep(speed);
        }
        array[j + 1] = key;
        renderArray();
        unmark(i);
        markAsSorted(i);
        await sleep(speed);
    }
    await finalizeSorting();
    enableControls();
}

async function mergeSort() {
    disableControls();
    await mergeSortHelper(array, 0, array.length - 1);
    await finalizeSorting();
    enableControls();
}

async function mergeSortHelper(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid);
        await mergeSortHelper(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
}

async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = new Array(n1);
    const R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
        renderArray();
        await sleep(speed);
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
    renderArray();
    for (let i = left; i <= right; i++) {
        markAsSorted(i);
        await sleep(speed);
    }
}

async function quickSort() {
    disableControls();
    await quickSortHelper(array, 0, array.length - 1);
    await finalizeSorting();
    enableControls();
}

async function quickSortHelper(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
            await sleep(speed);
        }
    }
    swap(arr, i + 1, high);
    await sleep(speed);
    return i + 1;
}

async function finalizeSorting() {
    for (let i = 0; i < array.length; i++) {
        markAsSorted(i);
        await sleep(speed);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray();

