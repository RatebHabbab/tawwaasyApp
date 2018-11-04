import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, Linking } from 'react-native';
import Loading2 from '../../../assets/images/Loading2.gif';
import Loading from '../../../assets/images/Loading.gif';

class splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: `https://tawwasy.com/appimage/logo.png?${new Date()}`
        }
    }
    render() {
        let imageNumber = Math.floor(Math.random() * 2);
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={{ uri: this.state.image }}
                />
                {
                    imageNumber === 0 ?
                        <Image
                            style={styles.Loading}
                            resizeMode="contain"
                            source={Loading}
                        />
                        :
                        <Image
                            style={styles.Loading}
                            resizeMode="contain"
                            source={Loading2}
                        />
                }
                <Text style={styles.splashText}>
                    جاري التحميل...
                </Text>
                <Text style={styles.aboutText} onPress={()=>Linking.openURL(`http://ejad.solutions/`)}>
                    ejad.solutions
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 400,
        height: 219,
        padding: 0
    },
    Loading: {
        height: 150
    },
    splashText: {
        textAlign: 'right',
        fontFamily: 'Tajawal-Bold',
        fontSize: 30,
    },
    aboutText: {
        textAlign: 'center',
        fontFamily: 'Oswald-Bold',
        fontSize: 20,
    }
})

export default splash;