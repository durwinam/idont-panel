```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Layout,
  Menu,
  Popover,
  Spin,
  message,
} from 'antd';
import {
  KeyOutlined,
  LockOutlined,
  MoonFilled,
  MoonOutlined,
  SunOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { FormProvider, useForm } from 'react-hook-form';
import { HttpUtil, LanguageManager } from '@/utils';
import { FormField, rhfZodValidate } from '@/components/form/rhf';
import { setMessageInstance } from '@/utils/messageBus';
import { pauseAnimationsUntilLeave, useTheme } from '@/hooks/useTheme';
import {
  LoginFormSchema,
  TwoFactorCodeSchema,
  type LoginFormValues,
} from '@/schemas/login';
import './LoginPage.css';

const HEADLINE_INTERVAL_MS = 2000;

type LoginForm = LoginFormValues;

const basePath = window.X_UI_BASE_PATH || '';

export default function LoginPage() {
  const { t } = useTranslation();

  const {
    isDark,
    isUltra,
    toggleTheme,
    toggleUltra,
    antdThemeConfig,
  } = useTheme();

  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    setMessageInstance(messageApi);
  }, [messageApi]);

  const [fetched, setFetched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [twoFactorEnable, setTwoFactorEnable] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const methods = useForm<LoginForm>({
    defaultValues: {
      username: '',
      password: '',
      twoFactorCode: '',
    },
  });

  const [lang, setLang] = useState(() =>
    LanguageManager.getLanguage(),
  );

  /*
   * -------------------------------------------------------
   * Login headline
   * -------------------------------------------------------
   */

  const headlineWords = useMemo(
    () => [
      t('pages.login.hello'),
      t('pages.login.title'),
    ],
    [t],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeadlineIndex(
        (index) => (index + 1) % headlineWords.length,
      );
    }, HEADLINE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [headlineWords.length]);

  /*
   * -------------------------------------------------------
   * Fetch 2FA state
   * -------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const msg = await HttpUtil.post('/getTwoFactorEnable');

        if (cancelled) return;

        if (msg.success) {
          setTwoFactorEnable(!!msg.obj);
        }
      } finally {
        if (!cancelled) {
          setFetched(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * -------------------------------------------------------
   * Login
   * -------------------------------------------------------
   */

  const onSubmit = useCallback(async (values: LoginForm) => {
    setSubmitting(true);

    try {
      const msg = await HttpUtil.post('/login', values);

      if (msg.success) {
        window.location.href = `${basePath}panel/`;
      }
    } finally {
      setSubmitting(false);
    }
  }, []);

  /*
   * -------------------------------------------------------
   * Language
   * -------------------------------------------------------
   */

  const onLangChange = useCallback((next: string) => {
    setLang(next);
    LanguageManager.setLanguage(next);
  }, []);

  /*
   * -------------------------------------------------------
   * Theme cycle
   *
   * Light
   *   ↓
   * Dark
   *   ↓
   * Ultra Dark
   *   ↓
   * Light
   * -------------------------------------------------------
   */

  const cycleTheme = useCallback(() => {
    pauseAnimationsUntilLeave('login-theme-cycle');

    if (!isDark) {
      toggleTheme();

      if (isUltra) {
        toggleUltra();
      }

      return;
    }

    if (!isUltra) {
      toggleUltra();
      return;
    }

    toggleUltra();
    toggleTheme();
  }, [
    isDark,
    isUltra,
    toggleTheme,
    toggleUltra,
  ]);

  /*
   * -------------------------------------------------------
   * Page classes
   * -------------------------------------------------------
   */

  const pageClass = useMemo(() => {
    const classes = ['login-app'];

    if (isDark) {
      classes.push('is-dark');
    }

    if (isUltra) {
      classes.push('is-ultra');
    }

    return classes.join(' ');
  }, [isDark, isUltra]);

  /*
   * -------------------------------------------------------
   * Language menu
   * -------------------------------------------------------
   */

  const langMenuItems = useMemo(
    () =>
      (
        LanguageManager.supportedLanguages as {
          value: string;
          name: string;
          icon: string;
        }[]
      ).map((language) => ({
        key: language.value,
        label: (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              {language.icon}
            </span>

            <span>{language.name}</span>
          </span>
        ),
      })),
    [],
  );

  /*
   * -------------------------------------------------------
   * Theme icon
   * -------------------------------------------------------
   */

  const themeIcon = !isDark ? (
    <MoonOutlined />
  ) : !isUltra ? (
    <MoonFilled />
  ) : (
    <SunOutlined />
  );

  return (
    <ConfigProvider theme={antdThemeConfig}>
      <Layout className={pageClass}>
        {messageContextHolder}

        <Layout.Content className="login-content">
          {/* -------------------------------------------------
              Toolbar
          -------------------------------------------------- */}

          <div className="login-toolbar">
            <Button
              id="login-theme-cycle"
              shape="circle"
              size="large"
              className="toolbar-btn"
              aria-label={t('menu.theme')}
              title={t('menu.theme')}
              icon={themeIcon}
              onClick={cycleTheme}
            />

            <Popover
              rootClassName={isDark ? 'dark' : 'light'}
              placement="bottomRight"
              trigger="click"
              styles={{
                content: {
                  padding: 5,
                  borderRadius: 16,
                },
              }}
              content={
                <Menu
                  mode="vertical"
                  selectable
                  selectedKeys={[lang]}
                  items={langMenuItems}
                  onClick={({ key }) =>
                    onLangChange(key)
                  }
                  style={{
                    border: 'none',
                    minWidth: 170,
                    background: 'transparent',
                  }}
                />
              }
            >
              <Button
                shape="circle"
                size="large"
                className="toolbar-btn"
                aria-label={t(
                  'pages.settings.language',
                )}
                title={t(
                  'pages.settings.language',
                )}
                icon={<TranslationOutlined />}
              />
            </Popover>
          </div>

          {/* -------------------------------------------------
              Login wrapper
          -------------------------------------------------- */}

          <div className="login-wrapper">
            {!fetched ? (
              <div className="login-loading">
                <Spin size="large" />
              </div>
            ) : (
              <div className="login-card">
                {/* -------------------------------------------------
                    Brand
                -------------------------------------------------- */}

                <div className="brand">
                  <span className="brand-name">
                    IDONT-PANEL
                  </span>

                  <span
                    className="brand-accent"
                    aria-hidden="true"
                  />
                </div>

                {/* -------------------------------------------------
                    Animated headline
                -------------------------------------------------- */}

                <h2 className="welcome">
                  <b key={headlineIndex}>
                    {headlineWords[headlineIndex]}
                  </b>
                </h2>

                {/* -------------------------------------------------
                    Login form
                -------------------------------------------------- */}

                <FormProvider {...methods}>
                  <Form
                    layout="vertical"
                    className="login-form"
                    onFinish={methods.handleSubmit(
                      onSubmit,
                    )}
                  >
                    <FormField
                      name="username"
                      label={t('username')}
                      rules={{
                        validate:
                          rhfZodValidate(
                            LoginFormSchema.shape
                              .username,
                          ),
                      }}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        autoComplete="username"
                        size="large"
                        placeholder={t(
                          'username',
                        )}
                        autoFocus
                      />
                    </FormField>

                    <FormField
                      name="password"
                      label={t('password')}
                      rules={{
                        validate:
                          rhfZodValidate(
                            LoginFormSchema.shape
                              .password,
                          ),
                      }}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        autoComplete="current-password"
                        size="large"
                        placeholder={t(
                          'password',
                        )}
                      />
                    </FormField>

                    {twoFactorEnable && (
                      <FormField
                        name="twoFactorCode"
                        label={t(
                          'twoFactorCode',
                        )}
                        rules={{
                          validate:
                            rhfZodValidate(
                              TwoFactorCodeSchema,
                            ),
                        }}
                      >
                        <Input
                          prefix={<KeyOutlined />}
                          autoComplete="one-time-code"
                          size="large"
                          placeholder={t(
                            'twoFactorCode',
                          )}
                        />
                      </FormField>
                    )}

                    <Form.Item className="submit-row">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        size="large"
                        block
                      >
                        {t('login')}
                      </Button>
                    </Form.Item>
                  </Form>
                </FormProvider>
              </div>
            )}
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
```
