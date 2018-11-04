import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class HorizontalScrollIcons extends Component {

    generateIcon = (categories) => (
        categories ?
            categories.map(item => (
                <View style={{ marginRight: 15 }} key={item.id}>
                    <Icon.Button
                        backgroundColor={
                            this.props.categorySelected.name !== item.name ? '#ed8f8e' : '#EF5350'
                        }
                        size={10}
                        borderRadius={100}
                        onPress={() => this.props.updateCategoryHandler(item.name, item.id)}
                    >
                        <Text style={{
                            color: '#ffffff',

                            marginRight: 6,
                            fontFamily: 'Tajawal-Bold'
                        }}>{item.name}</Text>
                    </Icon.Button>
                </View>
            ))
            : null
    )

    render() {
        return (
            <ScrollView
                horizontal={true}
                decelerationRate={0}
                snapToInterval={200}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.scrollContainer}>
                    {this.generateIcon(this.props.categories)}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 10,
        width: '100%',
    }
})

export default HorizontalScrollIcons;