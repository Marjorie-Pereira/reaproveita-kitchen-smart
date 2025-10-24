import { Pressable, StyleSheet, TextInput, View } from 'react-native';

const Input = ( {...props}) => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      
      <TextInput 
      style={{flex: 1}}
      placeholderTextColor={'#49454F'}
      ref={props.inputRef && props.inputRef}
      {...props} />

      {props.type === 'password' ? (
        <Pressable onPress={props.togglePassword && props.togglePassword} >
          {props.icon && props.icon}
        </Pressable>
      ): (
        props.icon && props.icon
      )}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderWidth: 0.4,
        borderColor: "#000",
        borderRadius: 50,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})