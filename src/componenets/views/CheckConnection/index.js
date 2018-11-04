import React, { Component } from 'react';
import { View, Text, BackHandler, Alert } from 'react-native';

class checkConnection extends Component {
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        Alert.alert(
            'إغلاق التطبيق',
            'هل تريد الخروج؟',
            [
                { text: 'لا', onPress: () => console.log('Cancel Pressed'), style: { fontFamily: 'Tajawal-Bold' } },
                { text: 'نعم', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Tajawal-Bold',
                        fontSize: 30,
                        textAlign: 'center'
                    }}
                >
                    يرجى التأكد من الاتصال بالانترنت
                </Text>
            </View>
        );
    }
}

export default checkConnection;