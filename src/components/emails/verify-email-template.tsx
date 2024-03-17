import { Html } from "@react-email/html";
import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";

import * as React from "react";

interface EmailProps {
  userFirstname: string;
  resetLink: string;
}

export const VerificationEmailTemplate = ({
  userFirstname,
  resetLink,
}: EmailProps) => (
  <Html>
    <Head />
    {/* <Preview>
       The NextAuthCourse platform that helps you in your services 
    </Preview> */}
    <Body style={main}>
      <Container style={container}>
        <svg
          id="logo-70"
          width="150"
          height="70"
          viewBox="0 0 78 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.469 21.7738 24.4689 21.7736 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z"
            className="ccustom"
            fill="#394149"
          ></path>{" "}
          <path
            d="M39.364 22.3934C38.3353 23.4221 36.9401 24 35.4853 24C33.05 24 30.9853 22.413 30.2692 20.2167L25.7982 24.6877C27.838 27.8819 31.4143 30 35.4853 30C38.5314 30 41.4527 28.7899 43.6066 26.636L62.636 7.6066C63.6647 6.57791 65.0599 6 66.5147 6C69.5442 6 72 8.45584 72 11.4853C72 12.9401 71.4221 14.3353 70.3934 15.364L63.364 22.3934C62.3353 23.4221 60.9401 24 59.4853 24C57.0498 24 54.985 22.4127 54.269 20.2162L49.798 24.6873C51.8377 27.8818 55.4141 30 59.4853 30C62.5314 30 65.4527 28.7899 67.6066 26.636L74.636 19.6066C76.7899 17.4527 78 14.5314 78 11.4853C78 5.14214 72.8579 0 66.5147 0C63.4686 0 60.5473 1.21005 58.3934 3.36396L39.364 22.3934Z"
            className="ccustom"
            fill="#394149"
          ></path>{" "}
        </svg>
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          {`Welcome to NextAuthCourse! We're excited to have you on board. To
          complete your registration and activate your account, please click on
          the following verification link:`}
        </Text>

        <Text style={paragraph}>
          {`Please note that this link is only valid for just one hour. After
          that, you will need to request a new verification email. If you did
          not sign up for a NextAuthCourse account, please ignore this email. If
          you have any questions or need assistance, please don't hesitate to
          contact our support team at`}{" "}
          <Link href="abdelrahmanaboneda.com">abdelrahmanaboneda.com</Link> .
          {`Thank you for choosing NextAuthCourse. We look forward to helping you
          accelerate your AI development journey.`}
        </Text>

        <Text style={paragraph}>
          Best regards,
          <br />
          The NextAuthCourse Team
        </Text>

        <Section style={btnContainer}>
          <Button
            style={{
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 3,
              fontSize: 17,
              backgroundColor: "black",
              opacity: "90%",
            }}
            href={resetLink}
          >
            Verify Email
          </Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}></Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
