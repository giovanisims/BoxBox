import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { useAuthForm } from '../../application/hooks/useAuthForm';
import { AuthForm } from '../components/AuthForm';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/AuthScreens';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const MIN_PASSWORD_LENGTH = 6;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    runAuthAction,
  } = useAuthForm('Sign up failed.');

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    await runAuthAction(async () => {
      await signUp(email.trim(), password);
      navigation.navigate('Login', {
        infoMessage:
          'Account created! Check your email to confirm, then sign in.',
      });
    });
  };

  return (
    <AuthForm
      subtitle="Create your account"
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      passwordPlaceholder="Password (min. 6 characters)"
      extraFields={
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          accessible={true}
          accessibilityLabel="Confirm password"
        />
      }
      error={error}
      loading={loading}
      submitLabel="Sign Up"
      submitAccessibilityLabel="Create account"
      loadingAccessibilityLabel="Creating account"
      onSubmit={handleSignUp}
      switchLabel="Already have an account? Sign In"
      switchAccessibilityLabel="Back to sign in screen"
      onSwitch={() => navigation.navigate('Login')}
    />
  );
}
