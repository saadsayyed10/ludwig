import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else if (signIn.status === "needs_second_factor") {
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-zinc-950 px-6 justify-center"
      >
        <View className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Verify account
          </Text>

          <Text className="text-zinc-400 mb-6">
            Enter the verification code sent to your email.
          </Text>

          <TextInput
            value={code}
            placeholder="Enter verification code"
            placeholderTextColor="#71717a"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
            className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-white text-base"
          />

          {errors.fields.code && (
            <Text className="text-red-500 text-sm mt-2">
              {errors.fields.code.message}
            </Text>
          )}

          <Pressable
            className={`mt-5 rounded-2xl py-4 items-center ${
              fetchStatus === "fetching" ? "bg-purple-700/50" : "bg-purple-500"
            }`}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            <Text className="text-white font-semibold text-base">Verify</Text>
          </Pressable>

          <Pressable
            className="mt-4 py-3 items-center"
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <Text className="text-purple-400 font-medium">
              I need a new code
            </Text>
          </Pressable>

          <Pressable
            className="py-3 items-center"
            onPress={() => signIn.reset()}
          >
            <Text className="text-zinc-400 font-medium">Start over</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-zinc-950 justify-center px-6"
    >
      <View className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white">Welcome back</Text>

          <Text className="text-zinc-400 mt-2 text-base">
            Sign in to continue to your account
          </Text>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-zinc-200 text-sm font-medium mb-2">
              Email address
            </Text>

            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#71717a"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              keyboardType="email-address"
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-white text-base"
            />

            {errors.fields.identifier && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.fields.identifier.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-zinc-200 text-sm font-medium mb-2">
              Password
            </Text>

            <TextInput
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#71717a"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-white text-base"
            />

            {errors.fields.password && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.fields.password.message}
              </Text>
            )}
          </View>

          <Pressable
            className={`rounded-2xl py-4 items-center mt-2 ${
              !emailAddress || !password || fetchStatus === "fetching"
                ? "bg-purple-700/50"
                : "bg-purple-500"
            }`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text className="text-white font-semibold text-base">
              {fetchStatus === "fetching" ? "Signing in..." : "Continue"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-zinc-400">Don't have an account?</Text>

          <Link href="/sign-up" asChild>
            <Pressable>
              <Text className="text-purple-400 font-semibold ml-1">
                Sign up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
