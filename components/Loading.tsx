import { ActivityIndicator, View } from 'react-native'

const Loading = ({size='large', color="#4A7D47"}: loadingProps) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

export default Loading

type loadingProps = {
    size?: number | "large" | "small" | undefined
    color?: string
}