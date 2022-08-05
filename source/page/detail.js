import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView, Image, Alert, TouchableOpacity
} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { height, width } from '../lib/utils';
import { Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import { likeProduct, unlikeProduct } from '../redux/product/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const DetailPage = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const dataProduct = useSelector(state => state.products.list_product);
    const loading = useSelector(state => state.products.load_category);
    const loadProduct = useSelector(state => state.products.load_product);
    const [productColor, setColor] = useState('');
    const [productImage, setImage] = useState('');
    const [productSize, setSize] = useState('');

    const { index } = route.params

    useEffect(() => {
        setColor(dataProduct[index].product_options[0].color)
        setImage(dataProduct[index].product_options[0].image)
        setSize(dataProduct[index].size_options[0])
    }, [isFocus]);

    const _handleChangeProduct = (color, image) => {
        setColor(color)
        setImage(image)
    }

    const _handleAddCart = async () => {
        let getItem = await AsyncStorage.getItem('cart')
        console.log(getItem)
        if (getItem) {
            let parseItem = JSON.parse(getItem)
            let arrFilter = parseItem.filter(el => el.id === dataProduct[index].id);
            if (arrFilter.length > 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Information',
                    text2: 'Product already added'
                });
            } else {
                let items = {
                    id: dataProduct[index].id
                }
                parseItem.push(items)
                Toast.show({
                    type: 'success',
                    text1: 'Information',
                    text2: 'Product successfully add to cart'
                });
                await AsyncStorage.setItem('cart', JSON.stringify(parseItem))
                navigation.pop(1)
            }
        } else {
            let parseItem = []
            let items = {
                id: dataProduct[index].id
            }
            parseItem.push(items)
            Toast.show({
                type: 'success',
                text1: 'Information',
                text2: 'Product successfully add to cart'
            });
            await AsyncStorage.setItem('cart', JSON.stringify(parseItem))
            navigation.pop(1)
        }
    }

    const _handleLike = () => {
        dispatch(likeProduct(index))
    }

    const _handleUnlike = () => {
        dispatch(unlikeProduct(index))
    }

    const _renderHeader = () => {
        return (
            <LinearGradient colors={['#b9f5ff', '#fff']} style={styles.bgHeader}>
                <View style={styles.containerHeader}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.pop(1)}>
                            <MCIcon color={'#000'} name={'arrow-left'} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerText}>Quickview</Text>
                    </View>
                    <View style={styles.headerRight}>
                        {
                            !dataProduct[index].like ?
                                <TouchableOpacity onPress={() => _handleLike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart-outline'} size={24} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => _handleUnlike(index)} style={[styles.boxIcon, { backgroundColor: '#b9f5ff', padding: 5 }]}>
                                    <Icon color={'red'} name={'heart'} size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                {_renderProduct()}
            </LinearGradient>
        )
    }

    const _renderProduct = () => {
        return (
            <View style={styles.containerProduct}>
                <View style={styles.productLeft}>
                    {
                        dataProduct[index].product_options.map((val, key) => {
                            return (
                                <TouchableOpacity key={key} onPress={() => _handleChangeProduct(val.color, val.image)}>
                                    <View style={[styles.itemColor, { backgroundColor: '#' + val.color }]}>
                                        {
                                            productColor == val.color &&
                                            <Icon color={'#fff'} name={'checkmark'} size={24} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.productCenter}>
                    {
                        productImage ?
                            <Image style={styles.productImage} source={{ uri: productImage }} />
                            :
                            <Icon name='images-outline' />
                    }
                </View>
                <View style={styles.productRight}>
                    {
                        dataProduct[index].size_options.map((val, key) => {
                            return (
                                <TouchableOpacity key={key} onPress={() => setSize(val)}>
                                    <View style={[styles.boxIcon, styles.itemColor, { borderRadius: 100, height: 30, width: 30, padding: 5 }]}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: productSize == val ? '#2786e4' : '#000' }}>{val}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    const _renderDescription = () => {
        return (
            <View style={styles.containerDesc}>
                <Text style={styles.titleText}>{dataProduct[index].title}</Text>
                <Text style={styles.subtitleText}>{dataProduct[index].sub_title}</Text>
                <View style={styles.rating}>
                    <Rating
                        showRating={false}
                        imageSize={20}
                        style={{ paddingVertical: 10 }}
                        readonly={true}
                        startingValue={dataProduct[index].rating}
                    />
                    <Text style={[styles.descText, { marginLeft: 10 }]}>({dataProduct[index].rating_count} Ratings)</Text>
                </View>
                <Text style={[styles.titleText, { fontSize: 18 }]}>Description</Text>
                <Text style={styles.descText}>{dataProduct[index].description}</Text>
                <Text style={styles.titleText}>$ {dataProduct[index].price}</Text>
            </View>
        )
    }

    const _renderBottom = () => {
        return (
            <TouchableOpacity onPress={() => _handleAddCart()} style={styles.containerBottom}>
                <Text style={styles.bottomText}>Add To Cart</Text>
                <MCIcon color={'#fff'} name={'cart-plus'} size={20} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ height: height, backgroundColor: '#fff' }}>
            {_renderHeader()}
            {_renderDescription()}
            {_renderBottom()}
            <Toast
                position='top'
                bottomOffset={20}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containerHeader: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerBottom: {
        flexDirection: 'row',
        backgroundColor: '#2786e4',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 10
    },
    bgHeader: {
        height: height * 0.25,
        backgroundColor: '#B9F5FF',
    },
    headerLeft: {
        alignItems: 'flex-start',
        width: '20%',
    },
    headerCenter: {
        alignItems: 'center',
        width: '60%',
    },
    headerRight: {
        alignItems: 'flex-end',
        width: '20%'
    },
    boxIcon: {
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
        shadowOffset: {
            width: 0.15,
            height: 0.15,
        },
        shadowOpacity: 0.075,
        shadowRadius: 5,
        elevation: 3,
    },
    headerText: {
        color: '#000',
        fontSize: 18,
    },
    containerProduct: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    productLeft: {
        width: '20%',
        alignItems: 'flex-start'
    },
    productRight: {
        width: '20%',
        alignItems: 'flex-end'
    },
    productCenter: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemColor: {
        height: 30,
        width: 30,
        borderRadius: 100,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        height: width * 0.3,
        width: width * 0.3
    },
    containerDesc: {
        padding: 20
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    },
    subtitleText: {
        fontSize: 18,
        color: '#000'
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    descText: {
        fontSize: 14,
        marginVertical: 10,
        color: '#000'
    },
})

export default DetailPage