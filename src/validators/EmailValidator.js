

const isEmpty = (str) => (!str?.length);

const isEmailValid = (str) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return !reg.test(str);
};

export { isEmpty, isEmailValid }