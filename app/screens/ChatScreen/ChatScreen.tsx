import React, {createRef} from 'react';
import {SafeAreaView} from 'react-native';
import ChatScreenStyles from './ChatScreen.styles';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

export const ChatScreen: React.FC = () => {
    let webViewRef = createRef<WebView>();
    const token = useSelector<RootState, string>(state => state.userState.user.token);

    return (
        <SafeAreaView style={ChatScreenStyles.container}>
            <WebView
                ref={webViewRef}
                source={{
                    uri: `https://map.makrab.net/#!/chat?token=${token}`,
                }}
            />
        </SafeAreaView>
    );
};
