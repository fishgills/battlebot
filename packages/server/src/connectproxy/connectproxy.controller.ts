import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller()
export class ConnectproxyController {
  @Get('.well-known/openid-configuration')
  config() {
    return {
      issuer: `https://slack.com`,
      authorization_endpoint: `https://api.${process.env['DOMAIN']}/openid/connect/authorize`,
      token_endpoint: `https://api.${process.env['DOMAIN']}/api/openid.connect.token`,
      userinfo_endpoint: `https://api.${process.env['DOMAIN']}/api/openid.connect.userInfo`,
      jwks_uri: `https://api.${process.env['DOMAIN']}/openid/connect/keys`,
      scopes_supported: [`openid`, `profile`, `email`],
      response_types_supported: ['code'],
      response_modes_supported: ['query'],
      grant_types_supported: ['authorization_code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      claims_supported: ['sub', 'auth_time', 'iss'],
      claims_parameter_supported: false,
      request_parameter_supported: false,
      request_uri_parameter_supported: true,
      token_endpoint_auth_methods_supported: [
        'client_secret_post',
        'client_secret_basic',
      ],
    };
  }

  @Get('openid/connect/authorize')
  authorize(@Query() params: ParameterDecorator) {
    return params;
  }
}
