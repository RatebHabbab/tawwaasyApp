import {
    Dimensions,
    Platform,
    AsyncStorage
} from 'react-native';

export const APIURL = `http://tawwasy.com/rest`;
export const APPTOKEN = `omhb0tb384cg9xfguqikmlpeouipq0o8`;

export const getOrientation = (value) => {
    return Dimensions.get("window").height > value ? "portrait" : "landscape"
}

export const setOrientationListener = (cb) => {
    return Dimensions.addEventListener("change", cb)
}

export const removeOrientationListener = () => {
    return Dimensions.removeEventListener("change")
}

export const getPlatform = () => {
    if (Platform.OS === 'ios') {
        return "ios"
    } else {
        return "android"
    }
}

export const gridTwoColumns = (list) => {
    let newArticles = [];
    let articles = list;
    let count = 1;
    let vessel = {};
    if (articles) {
        for (let i = 0; i < articles.length; i++) {
            if (count == 1) {
                vessel["blockOne"] = articles[i];
                count++;
                if (i === articles.length - 1) {
                    newArticles.push(vessel);
                }
            } else {
                vessel["blockTwo"] = articles[i];
                newArticles.push(vessel);

                count = 1;
                vessel = {};
            }
        }
    }
    return newArticles;
}

export const gridThreeColumns = (list) => {
    let newArticles = [];
    let articles = list;
    let count = 1;
    let vessel = {};
    if (articles) {
        articles.forEach(element => {
            if (count == 1) {
                vessel["blockOne"] = element;
                count++;
            } else if (count == 2) {
                vessel["blockTwo"] = element;
                count++;
            }
            else {
                vessel["blockThree"] = element;
                newArticles.push(vessel);

                count = 1;
                vessel = {};
            }
        })
    }
    return newArticles;
}

export const setCart = (value, cb) => {
    AsyncStorage.setItem('@tawwasyApp@cart', value).then(
        response => {
            cb();
        })
}

export const setProducts = (value, cb) => {
    AsyncStorage.setItem('@tawwasyApp@products', value).then(
        response => {
            cb();
        })
}