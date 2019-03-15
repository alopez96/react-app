import { Dimensions } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

module.exports = {
    screenWidth: WIDTH,
    screenHeight: HEIGHT
}