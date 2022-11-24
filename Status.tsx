import React, {
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { View, Animated, Text, StatusBar, StyleSheet ,Modal} from "react-native";

const Status = forwardRef((props, ref) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [modalShown, setModalShown] = useState(false);
  const [message, setMessage] = useState("Success!");
  const [toastColor, setToastColor] = useState("green");
  const [textColor, setTextColor] = useState("black");

  const closeToast = () => {
    setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        StatusBar.setBarStyle("default");
        setModalShown(false);
      });
    },1000);
  };

  const callToast = (message:any, type:any) => {
    if (modalShown) return;
    setToastType(message, type);
    setModalShown(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start(closeToast);
  };

  let animation = animatedValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [-100, -10, 0],
  });

  useImperativeHandle(ref, () => ({
    success(message: any) {
      callToast(message, "success");
      StatusBar.setBarStyle("dark-content");
    },
    error(message: any) {
      callToast(message, "error");
      StatusBar.setBarStyle("light-content");
    },
  }));

  const setToastType = (message = "Success!", type = "success") => {
    let color;
    let textColorValue;
    if (type == "error") {
      color = "#e32f45";
      textColorValue = "white";
    }
    if (type == "success") {
      color = "#1ed760";
      textColorValue = "white";
    }
    setMessage(message);
    setToastColor(color);
    setTextColor(textColorValue);
  };

  return modalShown ? (
    <Modal transparent={true}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: toastColor,
            transform: [{ translateY: animation }],
          },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        </View>
      </Animated.View>
    </Modal>
  ) : null;
});

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    minHeight: 100,
    width: "100%",
    backgroundColor: "green",
    zIndex: 1000,
    justifyContent: "flex-end",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  message: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 10,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Status;
