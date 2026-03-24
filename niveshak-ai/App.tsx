import './global.css';
import { View, Text } from 'react-native';
import { t } from '@i18n/index';

export default function App() {
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#0D0D0D',
    }}>
      <Text style={{ color: '#AAFF00', fontSize: 18, marginBottom: 12 }}>
        {t('landing.ctaPrimary')}
      </Text>
      <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
        {t('app.tagline')}
      </Text>
      <Text style={{ color: '#B0B0B0', fontSize: 12, marginTop: 12 }}>
        {t('nav.discover')}
      </Text>
    </View>
  );
}