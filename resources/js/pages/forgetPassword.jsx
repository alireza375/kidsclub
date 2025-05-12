import React, { useState } from "react";
import { useI18n } from "../providers/i18n";
import { PageHeader } from "../components/common/upperSection";
import { message, notification } from "antd";
import { sendOtp } from "../helpers/backend";
import OtpModal from "../components/common/Navbar/OtpModal";
import { useModal } from "../context/modalContext";
import { useTitle } from "../helpers/hooks";
import { useSite } from "../context/site";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [data, setData] = useState({});
  const i18n = useI18n();
  const [continuing, setContinuing] = useState(false);
  const { openLoginModal } = useModal();
  const {sitedata} = useSite();
  useTitle(`${sitedata?.title || "KidStick"} | Forget Password`);

  const handleForgetPasswordSubmit = async (e) => {
    e.preventDefault();
    setContinuing(true);
    if (!email) {
      message.error(i18n?.t("Please enter your email address"));
      return;
    }

    try {
      const res = await sendOtp({
        email: email,
        action: "forgot_password",
      });

      if (res?.success) {
        setContinuing(false);
        notification.success({ message: res?.message });
        setIsOtpModalOpen(true); // Open the modal
        setData(res?.data); // Pass data to the modal
      } else {
        notification.error({ message: res?.message });
      }
    } catch (error) {
      notification.error({ message: i18n?.t("Something went wrong") });
      setContinuing(false);

    }
    finally{
        setContinuing(false);
    }
  };

  return (
    <div className="bg-coralred">
      <PageHeader title="Forget-Password" />
      <div className="custom-container py-20">
        <div className="md:flex flex-col justify-center items-center">
          <div className="md:max-w-md relative z-10">
            <h1 className="m:text-2xl text-2xl font-bold mb-4 md:mt-0 mt-5 text-center">
              {i18n?.t("Forgot your password")}?
            </h1>
            <p className="text-sm font-normal text-gray-800 mb-6 text-center">
              {i18n?.t(
                "Please confirm your email address below and we will send you a verification code."
              )}
            </p>
            <form onSubmit={handleForgetPasswordSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-2">{i18n?.t("Email")}</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-transparent focus:border-primary focus:border-dashed"
                />
              </div>
              <button
                type="submit"
                className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full"
                disabled={continuing}
              >
                {continuing ? i18n?.t("Loading") : i18n?.t("Continue")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Conditionally Render the OtpModal */}
      {isOtpModalOpen && (
        <OtpModal
          setIsOtpModalOpen={setIsOtpModalOpen}
          getEmail={email}
          registrationValues={data}
          openLoginModal={openLoginModal}
          forgetAction={"forgot_password"}
        />
      )}
    </div>
  );
};

export default ForgetPassword;
