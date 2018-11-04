//Packages:
import React, { Component } from 'react';
import { BackHandler, Alert, NetInfo, AsyncStorage } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//Actions:
import { getAllProducts } from '../../Store/actions/products_actions';
//Components:
import Categories from '../Categories/index';
import Home from '../Home';
import splash from '../Splash';
import SidedrawerComponent from '../Sidedrawer';
import checkout from '../Checkout';
import checkConnection from '../CheckConnection';
//Images:
import bm from '../../../assets/images/menu-alt-512.png';

class RouterComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        }
        global.cart = [];
        global.products = [];
    }

    async getCache() {
        try {
            let value = await AsyncStorage.getItem('@tawwasyApp@cart');
            if (value != null) {
                AsyncStorage.getItem('@tawwasyApp@cart')
                    .then(req => { global.cart = JSON.parse(req) })
                    .then(json => console.log(json))
                    .catch(error => console.log('error!'));
            }
            else {
            }
        }
        catch (e) {
        }
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.getCache();
                this.props.getAllProducts(-1).then(() => {
                    this.props.Products.list.map(
                        pr => {
                            let x = global.cart.findIndex(element => element.name == pr.name);
                            if (x === -1) {
                                global.products = [...global.products, { ...pr, count: 0 }];
                            } else {
                                global.products = [...global.products, { ...pr, count: global.cart[x].count }];
                            }
                        }
                    )
                    Actions.home({ allProducts: global.products });
                });
            }
            else {
                Actions.checkConnection();
            }
        })
    }

    render() {
        return (
            <Router
                navigationBarStyle={{ backgroundColor: '#FFCC00' }}
            >
                <Scene
                    key="root"
                    titleStyle={{ textAlign: 'center', flex: 1, color: 'white', fontFamily: 'Tajawal-Bold', fontWeight: 'normal' }}
                    drawer={true}
                    drawerPosition="right"
                    cardStyle={{ backgroundColor: '#f6f6f6' }}
                    contentComponent={SidedrawerComponent}
                    drawerImage={bm}
                    backButtonTintColor="white"
                    back
                >
                    <Scene key="main">
                        <Scene
                            key="splash"
                            component={splash}
                            hideNavBar
                            initial
                        />
                        <Scene
                            key="home"
                            component={Categories}
                            title="متجر تواصي"
                            onBack={() => {
                                Alert.alert(
                                    'إغلاق التطبيق',
                                    'هل تريد الخروج؟',
                                    [
                                        { text: 'لا', onPress: () => console.log('Cancel Pressed'), style: { fontFamily: 'Tajawal-Bold' } },
                                        { text: 'نعم', onPress: () => BackHandler.exitApp() },
                                    ],
                                    { cancelable: false });
                                return true;
                            }}
                        />
                        <Scene
                            key="products"
                            component={Home}
                            title="products"
                            back
                            onBack={() => { Actions.popTo('home'); }}
                        />
                        <Scene
                            key="checkout"
                            component={checkout}
                            title="سلة المشتريات"
                            back
                        />
                        <Scene
                            key="checkConnection"
                            component={checkConnection}
                            hideNavBar
                        />
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        Products: state.Products
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllProducts }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterComponent);