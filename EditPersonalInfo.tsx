import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  ToastAndroid
} from "react-native";
import React, { useEffect, useReducer, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { svg } from "../svg";
import { theme } from "../constants";
import { components } from "../components";
import RNDateTimePicker from "@react-native-community/datetimepicker"; 
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import logger from "use-reducer-logger";
import NetInfo from "@react-native-community/netinfo";
import Status from "../components/Status";



const reducer = (state:any, action:any) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, information: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const EditPersonalInfo: React.FC = ({ navigation }: any) => {
  const [Name, SetName] = useState("");
  const [PhoneNumber, SetPhoneNumber] = useState("");
  const [MailId, SetMailId] = useState("");
  const [DOB, SetDOB] = useState("");
  const [Address, SetAddress] = useState("");

  const [CheckName, SetCheckName] = useState(false);
  const [CheckPhoneNumber, SetCheckPhoneNumber] = useState(false);
  const [CheckMailId, SetCheckMailId] = useState(false);
  const [CheckDOB, SetCheckDOB] = useState(false);
  const [CheckAddress, SetCheckAddress] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<string>("date");
  const [show, setShow] = useState(false);

  //netinfo
  const [netinfos, setnetinfos] = useState(true);
  //tost
  const [toast,setToast]=useState()

    //  const [loading, setLoading] = useState(false);
    //  const [information, setInformation] = useState(false);

  // date
  const today = new Date();
  const getdate = today.getDate();
  const getmonth = today.getMonth();
  const getYr = today.getFullYear();
  const maxDays = new Date(getYr - 18, getmonth, getdate);

  //api usesate


  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  
  //Api fetch
   const [{ loading, error, information }, dispatch] = useReducer(logger(reducer), {
     information: [],
     loading: true,
     error: "",
   });

   const toastRef = useRef(null);
   
  const headers = {
    "Content-Type": "application/json",
  };


      const submitHandler = () => {
        

          
        if (Name.length < 5) {
          SetCheckName(true);
        } else if (PhoneNumber.length < 10) {
          SetCheckPhoneNumber(true);
        } else if (Address.length < 20) {
          SetCheckAddress(true);
        } else  { let addPost = fetch("http://192.168.1.9:5000/updateUsersData?id=1", {
          method: "POST",
          headers,
          body: JSON.stringify({
            User_Name: Name,
            User_PhoneNumber: PhoneNumber,
            User_Email: MailId,
            User_D_O_B: DOB,
            User_Address: Address,
          }),
        })
          .then((res) => res.json())
          .then((resJson) => {
            console.log("post:", resJson);
              let ToastMsgSend;

             if (addPost != null && addPost != undefined) {
               ToastMsgSend = "success";
             }
             else{ToastMsgSend = "failed";}

          navigation.navigate("MyAccount", { ToastMsg: ToastMsgSend });
    console.log(addPost)
      
          })
          .catch((e) => {
            console.log("error",e);
            navigation.navigate("MyAccount", { ToastMsg: "failure" });
          })
      };
      };
        useEffect(() => {

          const getPosts = async () => {
            dispatch({ type: "FETCH_REQUEST" });
                try {
            const result = await fetch(
              "http://192.168.1.9:5000/getUsersData?id=1"
            )
              .then((res) => res.json())
              .then((resJson) => {
                SetName(resJson[0].User_Name);
                SetPhoneNumber(resJson[0].User_Phone_no);
                SetMailId(resJson[0].User_Email_Id);
                SetDOB(resJson[0].D_O_B);
                SetAddress(resJson[0].Address);
                // setInformation(result);
                // setLoading(true);
              })
              dispatch({ type: "FETCH_SUCCESS", payload: result});
            } catch(err: any)  {
                 dispatch({ type: "FETCH_FAIL", payload: err.message });
              };
          };

          getPosts();
        }, []);
        

 useEffect(() => {
   const data = NetInfo.addEventListener((state) => {
     const offline = !(state?.isConnected && state?.isInternetReachable);
     setnetinfos(offline);
     console.log(offline);
   });

   return () => {
     data();
   };
 }, []);




  // const submitHandler = () => {
  
  //   fetch("http://192.168.1.9:5000/postUsersData?id=1", {
  //     method: "POST",
  //     headers,
  //     body: JSON.stringify({
  //       User_Name: Name,
  //       User_PhoneNumber: PhoneNumber,
  //       User_Email: MailId,
  //       User_D_O_B: DOB,
  //       User_Address: Address,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((resJson) => {
  //       console.log("post:", resJson);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  //   if (Name.length < 5) {
  //     SetCheckName(true);
  //   } else if (PhoneNumber.length < 10) {
  //     SetCheckPhoneNumber(true);
  //   } else if (Address.length < 20) {
  //     SetCheckAddress(true);
  //   } else navigation.navigate("MyAccount");

  //   console.log(Name, PhoneNumber, MailId, DOB, Address);
  // };
  

  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios" ? true : false);
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();

    SetDOB(fDate);
  };
  const showMode = (currentMode:any) => {
    setShow(true);
    setMode(currentMode);
  };


  const validateName = (text:any) => {
    let re = /^.{6,}$/;
    SetName(text);

    if (re.test(text)) {
      SetCheckName(false);
    } else {
      SetCheckName(true);
    }
  };

  const validatePhoneNumber = (text:any) => {
    let re = /^.{10,}$/;
    SetPhoneNumber(text);

    if (re.test(text)) {
      SetCheckPhoneNumber(false);
    } else {
      SetCheckPhoneNumber(true);
    }
  };

  const validateMailId = (text:any) => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    SetMailId(text);

    if (re.test(text) || regex.test(text)) {
      SetCheckMailId(false);
    } else {
      SetCheckMailId(true);
    }
  };

  const validateDOB = (text:any) => {
    let re = /^\d{2}\/\d{2}\/\d{4}$/;
    SetDOB(text);

    if (re.test(text)) {
      SetCheckDOB(false);
    } else {
      SetCheckDOB(true);
    }
  };

  const validateAddress = (text:any) => {
    let re = /^.{6,}$/;
    SetAddress(text);

    if (re.test(text)) {
      SetCheckAddress(false);
    } else {
      SetCheckAddress(true);
    }
  };

  const renderHeader = () => {
    return <components.Header title="Edit personal info" goBack={true} />;
  };

  const renderUserPhoto = () => {
    return (
      <TouchableOpacity
        style={{
          width: 70,
          height: 70,
          alignSelf: "center",
          marginVertical: 20,
        }}
      >
        <ImageBackground
          source={require("../assets/users/01.png")}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            marginRight: 16,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(27, 29, 77, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 35,
            }}
          >
            <svg.EditPhotoSvg />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const renderInputFields = () => {
    return (
      <View>
        <Text style={{ left: 5, bottom: 4 }}>Enter Your Name</Text>
        <components.InputField
          placeholder="Your Name"
          value={Name}
          onChangeText={(text) => validateName(text)}
          autoComplete="off"
          onSubmitEditing={Keyboard.dismiss}
          containerStyle={{
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
        />
        {CheckName ? (
          <Text style={{ bottom: 15, left: 10, color: "red" }}>
            Enter Valid Name
          </Text>
        ) : (
          ""
        )}

        <Text style={{ left: 5, bottom: 4 }}>Phone Number</Text>
        <components.InputField
          placeholder="+91 | xxxxxxxxxx"
          value={PhoneNumber}
          onChangeText={(text) => validatePhoneNumber(text)}
          onSubmitEditing={Keyboard.dismiss}
          maxLength={10}
          keyboardType="phone-pad"
          autoComplete="off"
          containerStyle={{
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
          leftIcon={
            <Image
              source={{
                uri: "https://dl.dropbox.com/s/ima3jsg6qhzu8v1/01.jpg?dl=0",
              }}
              style={{ width: 20.59, height: 14, marginRight: 6 }}
            />
          }
        />
        {CheckPhoneNumber ? (
          <Text style={{ bottom: 15, left: 10, color: "red" }}>
            Enter Valid Phone Number
          </Text>
        ) : (
          ""
        )}

        <Text style={{ left: 5, bottom: 4 }}>E-mail id </Text>
        <components.InputField
          placeholder="Enter your email"
          onSubmitEditing={Keyboard.dismiss}
          value={MailId}
          keyboardType="email-address"
          autoComplete="off"
          onChangeText={(text) => validateMailId(text)}
          containerStyle={{
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
        />
        {CheckMailId ? (
          <Text style={{ bottom: 15, left: 10, color: "red" }}>
            Enter Valid E-mail Id
          </Text>
        ) : (
          ""
        )}

        <Text style={{ left: 5, bottom: 4 }}>D.O.B</Text>
        <Pressable style={{ width: "100%" }} onPress={() => showMode("date")}>
          <components.InputField
            placeholder="MM/DD/YYYY"
            value={DOB}
            editable={false}
            onChangeText={(text) => validateDOB(text)}
            keyboardType="numeric"
            autoComplete="off"
            onSubmitEditing={Keyboard.dismiss}
            containerStyle={{
              paddingHorizontal: 20,
              marginBottom: 14,
            }}
            rightIcon={
              <Image
                source={require("../assets/other-icons/24.png")}
                style={{ width: 16, height: 16 }}
              />
            }
          />
        </Pressable>
        {show && (
          <Modal transparent={true}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#380C1A7C",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      Platform.OS === "ios" ? "white" : "#38383800",
                    height: 300,
                    width: 300,
                    marginTop: windowHeight / 1.92,
                    padding: 15,
                    borderRadius: 15,
                  }}
                >
                  <DateTimePicker
                    style={{ flex: 1 }}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    maximumDate={maxDays}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChange}
                  />
                  <View>
                    {Platform.OS === "ios" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Pressable
                          style={{
                            backgroundColor: "#e32f45",
                            borderRadius: 5,
                          }}
                          onPress={() => {
                            setShow(false);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#ffffff",
                              padding: 6,
                              fontWeight: "500",
                            }}
                          >
                            Confirm
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {CheckDOB ? (
          <Text style={{ bottom: 15, left: 10, color: "red" }}>
            Enter Valid DOB
          </Text>
        ) : (
          ""
        )}

        <Text style={{ left: 5, bottom: 4 }}>Address</Text>
        <components.InputField
          placeholder="Enter your address"
          value={Address}
          onChangeText={(text) => validateAddress(text)}
          onSubmitEditing={Keyboard.dismiss}
          autoComplete="off"
          containerStyle={{
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
        />

        {CheckAddress ? (
          <Text style={{ bottom: 15, left: 10, color: "red" }}>
            Enter Valid Address
          </Text>
        ) : (
          ""
        )}
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View>
        <Pressable
          onPress={() => submitHandler()}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#e32f45",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#ffffff",
              fontWeight: "500",
              fontSize: 17,
            }}
          >
            Save
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
      >
        {renderUserPhoto()}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
        >
          {renderInputFields()}
          {renderButton()}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.bgColor }}>
      {loading ? (
        <LoadingBox />
      ) : netinfos ? (
        <MessageBox />
      ) : (
        <View>
          {renderHeader()}
          {renderContent()}
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditPersonalInfo;
