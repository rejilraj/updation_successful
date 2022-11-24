import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { svg } from "../svg";
import { theme } from "../constants";
import { components } from "../components";
import Status from "../components/Status";

const Profile: React.FC = ({ navigation, route }: any) => {
    const renderHeader = () => {
        return <components.Header title="My Account" goBack={true} />;
    };


    useEffect(() => {
      if (route !== undefined && route !== null) {
        const Status = route.params;
        console.log("getParms :", Status);
        if (Status != undefined && Status != null) {
          if (Status.ToastMsg != "failure") {
            success();
          } else{
            failed();
          }
        } else {
           null
        }
      } else{
        null
      }
    });

const toastRef = useRef(null);
     const success = () => {
       toastRef?.current?.success("Updated Successful");
     };

       const failed = () => {
         toastRef?.current?.error("Updation Failed");
       };
    const renderProfileCategory = () => {
        return (
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <View style={{ paddingBottom: 15 }}>
              <Text style={{ fontWeight: "bold", padding: 10 }}>
                Basic Information
              </Text>
              <components.ProfileCategory
                title="Business Details"
                icon={<svg.BusinessSvg />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("BusinessDetailsInfo")}
              />
              <components.ProfileCategory
                title="Personal Details"
                icon={<svg.UserOneSvg />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("EditPersonalInfo")}
              />
            </View>
            <View style={{ paddingBottom: 15 }}>
              <Text style={{ fontWeight: "bold", padding: 10 }}>KYC</Text>
              <components.ProfileCategory
                title="Bank Account"
                icon={<svg.BankSVG />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("BankInformation")}
              />
              <components.ProfileCategory
                title="PAN Details"
                icon={<svg.PanSVG />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("PANdetails")}
              />
              <components.ProfileCategory
                title="Aadhaar Details"
                icon={<svg.AadharSVG />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("AadhaarDetails")}
              />
              <components.ProfileCategory
                title="Photo"
                icon={<svg.PhotoSVG />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("PhotoDetails")}
              />
            </View>
            <View style={{ paddingBottom: 15 }}>
              <Text style={{ fontWeight: "bold", padding: 10 }}>
                Others Documents
              </Text>
              <components.ProfileCategory
                title="GST Details"
                icon={<svg.GSTSVG />}
                rightElement={<svg.ArrowOneSvg />}
                onPress={() => navigation.navigate("GstDetailInfo")}
              />
            </View>
          </View>
        );
    };

    const renderContent = () => {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {renderProfileCategory()}
            </ScrollView>
        );
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.bgColor }}>
        <Status ref={toastRef} />
        {renderHeader()}
        {renderContent()}
      </SafeAreaView>
    );
};

export default Profile;
