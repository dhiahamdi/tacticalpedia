import TranslateService from "./translate";

var emailjs = require("emailjs/email");

export default class MailerService{

    private  emailServer;

    constructor(){

        this.emailServer = emailjs.server.connect(
            {
                host 	    : process.env.NL_EMAIL_HOST || 'email-smtp.eu-west-2.amazonaws.com',
                user 	    : process.env.NL_EMAIL_USER || 'AKIA5UWPEYVBV7B6Z5HR',
                password    : process.env.NL_EMAIL_PASS || 'BKjz0fbIhdtJ+bLU9zvGw/5kXfmVVLbwilxmxCYzTqUg',
                ssl		    : true
            });
    }

    /**
     * Admin mail
    */
     public sendAdminNewUser(email: string, username: string) {
        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : process.env.ADMIN_EMAIL,
            subject      : 'Nuovo utente su Tacticalpedia',
            text         : `Un nuovo utente si è registrato su Tacticalpedia. Username: ${username} , email: ${email}`,
        },
        function (err, message) {
            console.log(err || message);
          });
    }

    /**
     * Admin mail
    */
     public sendAdminNewSubscription(username: string, type: string) {
        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : process.env.ADMIN_EMAIL,
            subject      : 'Nuovo abbonamento su Tacticalpedia',
            text         : `L'utente ${username} ha appena attivato un abbonamento con ${type}.`,
        },
        function (err, message) {
            console.log(err || message);
          });
    }


     /**
     * Admin mail
    */
      public sendAdminNewTraining(trainingId: string, trainingName: string) {
        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : process.env.ADMIN_EMAIL,
            subject      : 'Nuovo allenamento pubblicato su Tacticalpedia',
            text         : `L'allenamento ${trainingName} è stato appena pubblicato su Tacticalpedia. URL: ${process.env.FRONT_END_URL}/training/${trainingId}`,
        },
        function (err, message) {
            console.log(err || message);
          });
    }

    /**
     * Notify user for payment method update
    */
    public sendPastDueEmail(email: string, username: string, lang: string) {
        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : email,
            subject      : 'Update your payment method',
            text         : 'Update your payment method',
            attachment   : this.composePastDueEmail(username, lang)
        },
        function (err, message) {
            console.log(err || message);
          });
    }


    private composePastDueEmail(username: string, lang: string) {

        const translateService = new TranslateService();

        const url = process.env.FRONT_END_URL + '/manage-subscription';

        var html = ` 
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
            <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
            <tr>
                <td>
                    <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
            <tr>
                <td class="heightsmalldevices" height="40">&nbsp;</td>
            </tr>
    
              <tr>
                  <td style="font:700 26px 'Montserrat', Helvetica, Arial, sans-serif; color:#f27b69; text-transform:uppercase; color: #00263f; padding: 10px;">${translateService.translate('Update your payment method', lang)}</td>
              </tr>
               <tr>
                  <td class="heightSDBottom" height="49">&nbsp;</td>
              </tr>
              <tr>
                  <td style="font:bold 18px Arial, Helvetica, sans-serif; color:#404040; ">${translateService.translate('Hi', lang)}, ` + username + `</td>
              </tr>
               <tr>
                  <td height="21">&nbsp;</td>
              </tr>
              <tr>
                  <td style="font:18px Arial, Helvetica, sans-serif; color:#404040; padding: 10px;">${translateService.translate('We were not able to collect your last payment for your subscription. Please update your payment method or you will lose access to Tacticalpedia and your library.', lang)}</td>
              </tr>
               <tr>
                  <td height="32">&nbsp;</td>
              </tr>
              <tr>
                                  <td align="center">
                                      <table width="250" align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center;">
              <tr>
              <td align="center" bgcolor="#af5372" style="border-radius:28px;" height="61"><a href="` + url + `" style="font:700 16px/61px 'Montserrat', Helvetica, Arial, sans-serif; color:#ffffff; text-decoration:none; display:block; overflow:hidden; outline:none; background: #039be5;">${translateService.translate('MANAGE SUBSCRIPTION', lang)}</a></td>
              </tr>
    
              </table>
    
                          </td>
                        </tr>
                        <tr>
                    <td class="heightsmalldevices" height="60">&nbsp;</td>
                </tr>
                </table>
                    </td></tr>
                    </table>
                </td></tr></table>
                
                <!-- ----------------- Block 8 End Here ------------------------- -->
    
                <!-- ----------------- Block 9 Start Here ------------------------- -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
                <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
                <tr>
                    <td>
                        <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
                <tr>
                    <td height="50">&nbsp;</td>
                </tr>
                <tr>
                    <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">${translateService.translate('If you already updated your payment method, feel free to ignore this message.', lang)}</td>
                </tr>
                <tr>
                    <td height="28">&nbsp;</td>
                </tr>
                <tr>
                    <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">${translateService.translate('If you do nott have any active subscription on Tacticalpedia', lang)}, <a href="#" style="color:#f27b69; text-decoration:none; ">${translateService.translate('contact our support center', lang)}</a></td>
                </tr>
                <tr>
                    <td height="32">&nbsp;</td>
                </tr>
                <tr>
                    </tr>
                <tr>
                <tr>
                    <td class="heightsmalldevices" height="60">&nbsp;</td>
                </tr>
                </table>
                    </td></tr>
                    </table>
                </td></tr></table>
            `;
        return [{data:this.getEmailLayout(html, lang), alternative:true}];
        
    }

    public sendConfirmationMail(email: String, username:String,  key: String, lang:string){

        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : email,
            subject      : 'Confirm your e-mail address',
            text         : 'Confirm your e-mail address',
            attachment   : this.composeConfirmEmail(email, username, key, lang)
        },
        function (err, message) {
            console.log(err || message);
          });

    }

    private composeConfirmEmail(email: String, username: String, key: String, lang: string){

        const translateService = new TranslateService();

        const url = process.env.FRONT_END_URL + '/confirmEmail?key=' + key + '&email=' + email;
              
        var html = ` 
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
            <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
            <tr>
                <td>
                    <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
            <tr>
                <td class="heightsmalldevices" height="40">&nbsp;</td>
            </tr>
    
              <tr>
                  <td style="font:700 26px 'Montserrat', Helvetica, Arial, sans-serif; color:#f27b69; text-transform:uppercase; color: #00263f;">${translateService.translate('CONFIRM E-MAIL ADDRESS', lang)}</td>
              </tr>
               <tr>
                  <td class="heightSDBottom" height="49">&nbsp;</td>
              </tr>
              <tr>
                  <td style="font:bold 18px Arial, Helvetica, sans-serif; color:#404040; ">${translateService.translate('Hi', lang)}, ` + username + `</td>
              </tr>
               <tr>
                  <td height="21">&nbsp;</td>
              </tr>
              <tr>
                  <td style="font:18px Arial, Helvetica, sans-serif; color:#404040;">${translateService.translate('Thank you for signup. Please verify your email address to activate your account.', lang)}</td>
              </tr>
               <tr>
                  <td height="32">&nbsp;</td>
              </tr>
              <tr>
                                  <td align="center">
                                      <table width="250" align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center;">
              <tr>
              <td align="center" bgcolor="#af5372" style="border-radius:28px;" height="61"><a href="` + url + `" style="font:700 16px/61px 'Montserrat', Helvetica, Arial, sans-serif; color:#ffffff; text-decoration:none; display:block; overflow:hidden; outline:none; background: #039be5;">${translateService.translate('CONFIRM E-MAIL ADDRESS', lang)}</a></td>
              </tr>
    
              </table>
    
                          </td>
                        </tr>
                        <tr>
                    <td class="heightsmalldevices" height="60">&nbsp;</td>
                </tr>
                </table>
                    </td></tr>
                    </table>
                </td></tr></table>
                
                <!-- ----------------- Block 8 End Here ------------------------- -->
    
                <!-- ----------------- Block 9 Start Here ------------------------- -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
                <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
                <tr>
                    <td>
                        <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
                <tr>
                    <td height="50">&nbsp;</td>
                </tr>
                <tr>
                    <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">${translateService.translate('If you ignore this message, your account will not be activated.', lang)}</td>
                </tr>
                <tr>
                    <td height="28">&nbsp;</td>
                </tr>
                <tr>
                    <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">${translateService.translate('If you did not signup to Tacticalpedia and this is a mistake.', lang)}, <a href="#" style="color:#f27b69; text-decoration:none; ">${translateService.translate('let us know', lang)}</a></td>
                </tr>
                <tr>
                    <td height="32">&nbsp;</td>
                </tr>
                <tr>
                    </tr>
                <tr>
                <tr>
                    <td class="heightsmalldevices" height="60">&nbsp;</td>
                </tr>
                </table>
                    </td></tr>
                    </table>
                </td></tr></table>
            `;
        return [{data:this.getEmailLayout(html, lang), alternative:true}];

    }

    public sendResetPasswordEmail(email: string, username: string, key: string, lang:string){

        this.emailServer.send({
            from         : process.env.NL_EMAIL_FROM || 'Tacticalpedia <noreply@tacticalpedia.com>',
            to           : email,
            subject      : 'Reset your password',
            text         : 'Reset your password',
            attachment   : this.composeResetPasswordEmail(email, username, key, lang)
        },
        function (err, message) {
            console.log(err || message);
          });

    }

    private composeResetPasswordEmail(email: string, username: string, key: string, lang:string ){
       
        const translateService = new TranslateService();

        const url = process.env.FRONT_END_URL + '/reset?key=' + key;
              
        var html = ` 
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
        <tr>
        <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
        <tr>
            <td>
                <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
        <tr>
            <td class="heightsmalldevices" height="40">&nbsp;</td>
        </tr>

          <tr>
              <td style="font:700 26px 'Montserrat', Helvetica, Arial, sans-serif; color:#f27b69; text-transform:uppercase; color: #00263f;">${translateService.translate('change your password', lang)}</td>
          </tr>
           <tr>
              <td class="heightSDBottom" height="49">&nbsp;</td>
          </tr>
          <tr>
              <td style="font:bold 18px Arial, Helvetica, sans-serif; color:#404040; ">${translateService.translate('Hi', lang)}, ` + username + `</td>
          </tr>
           <tr>
              <td height="21">&nbsp;</td>
          </tr>
          <tr>
              <td style="font:18px Arial, Helvetica, sans-serif; color:#404040;">${translateService.translate('We got a request to reset your password.', lang)}</td>
          </tr>
           <tr>
              <td height="32">&nbsp;</td>
          </tr>
          <tr>
                              <td align="center">
                                  <table width="250" align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center;">
          <tr>
          <td align="center" bgcolor="#af5372" style="border-radius:28px;" height="61"><a href="` + url + `" style="font:700 16px/61px 'Montserrat', Helvetica, Arial, sans-serif; color:#ffffff; text-decoration:none; display:block; overflow:hidden; outline:none; background: #039be5;">${translateService.translate('RESET PASSWORD', lang)}</a></td>
          </tr>

          </table>

                      </td>
                    </tr>
                    <tr>
                <td class="heightsmalldevices" height="60">&nbsp;</td>
            </tr>
            </table>
                </td></tr>
                </table>
            </td></tr></table>
            
            <!-- ----------------- Block 8 End Here ------------------------- -->

            <!-- ----------------- Block 9 Start Here ------------------------- -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
            <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
            <tr>
                <td>
                    <table width="100%" bgcolor="#f7f7f7"  border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="text-align:center; border-bottom:1px solid #e5e5e5;">
            <tr>
                <td height="50">&nbsp;</td>
            </tr>
            <tr>
                <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">${translateService.translate('If you ignore this message, your password will not be be changed.', lang)}</td>
            </tr>
            <tr>
                <td height="28">&nbsp;</td>
            </tr>
            <tr>
                <td style="font:16px Arial, Helvetica, sans-serif; color:#404040; padding:0 10px;">If you didn't request a password reset, <a href="#" style="color:#f27b69; text-decoration:none; ">${translateService.translate('let us know', lang)}</a></td>
            </tr>
            <tr>
                <td height="32">&nbsp;</td>
            </tr>
            <tr>
                </tr>
            <tr>
            <tr>
                <td class="heightsmalldevices" height="60">&nbsp;</td>
            </tr>
            </table>
                </td></tr>
                </table>
            </td></tr></table>
        `;

        

        return [{data:this.getEmailLayout(html, lang), alternative:true}];

    }


    private getEmailLayout(content: string, lang?: string) {

        if (!lang) lang='en';

        const translateService = new TranslateService();

        return `

        <style type="text/css">
div, p, a, li, td {
	-webkit-text-size-adjust:none;
}
.ReadMsgBody {
	width: 100%;
	background-color: #cecece;
}
.ExternalClass {
	width: 100%;
	background-color: #cecece;
}
body {
	width: 100%;
	height: 100%;
	background-color: #cecece;
	margin:0;
	padding:0;
	-webkit-font-smoothing: antialiased;
}
html {
	width: 100%;
}
img{
	border:none;
	}
table td[class=show]{
	display:none !important;
	}
@media only screen and (max-width: 640px) {
body {
 	width:auto!important;
}
table[class=full] {
 width:100%!important;
}
table[class=devicewidth] {
 width:100% !important;
 padding-left:20px !important;
 padding-right: 20px!important;
}
table[class=inner] {
 width:100%!important;
 text-align: center!important;
 clear: both;
}
table[class=inner-centerd] {
 width:78%!important;
 text-align: center!important;
 clear: both;
 float:none !important;
 margin:0 auto !important;
}
table td[class=hide], .hide {
 display:none !important;
}
table td[class=show], .show{
	display:block !important;
	}
img[class=responsiveimg]{
 width:100% !important;
 height:atuo !important;
 display:block !important;
}
table[class=btnalign]{
	float:left !important;
	}
table[class=btnaligncenter]{
	float:none !important;
	margin:0 auto !important;
	}
table td[class=textalignleft]{
	text-align:left !important;
	padding:0 !important;
	}
table td[class=textaligcenter]{
	text-align:center !important;
	}
table td[class=heightsmalldevices]{
	height:45px !important;
	}
table td[class=heightSDBottom]{
	height:28px !important;
	}
table[class=adjustblock]{
	width:87% !important;
	}
table[class=resizeblock]{
	width:92% !important;
	}
table td[class=smallfont]{
	font-size:8px !important;
	}
	}
@media only screen and (max-width: 520px) {
table td[class=heading]{
	font-size:24px !important;
	}
table td[class=heading01]{
	font-size:18px !important;
	}
table td[class=heading02]{
	font-size:27px !important;
	}
table td[class=text01]{
	font-size:22px !important;
	}
table[class="full mhide"], table tr[class=mhide]{
	display:none !important;
	}
	}
@media only screen and (max-width: 480px) {
table {
 border-collapse: collapse;
}
table[id=colaps-inhiret01],
table[id=colaps-inhiret02],
table[id=colaps-inhiret03],
table[id=colaps-inhiret04],
table[id=colaps-inhiret05],
table[id=colaps-inhiret06],
table[id=colaps-inhiret07],
table[id=colaps-inhiret08],
table[id=colaps-inhiret09]{
	border-collapse:inherit !important;
	}
}
@media only screen and (max-width: 320px) {
	}
</style>
       
<!-- ----------------- Block 8 Start Here ------------------------- -->

<!-- ----------------- Header Start Here ------------------------- -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
  <tr>
    <td align="center"><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
        <tr>
          <td><table width="100%" bgcolor="#f7f7f7" border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="background-color:#f7f7f7; border-radius:5px 5px 0 0;">
              <tr>
                <td><table width="265" align="left" border="0" cellspacing="0" cellpadding="0" class="inner" style="text-align:center; margin-left: 10px">
                <tr>
                      <td width="28" height="52">&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                    <td width="28">&nbsp;</td>
                      <td align="center" valign="middle"><a href="#"><img src="https://tacticalpedia.polarispartner.com/assets/images/logos/TacticalpediaBluLungo.png" width="300" alt="Tacticalpedia"></a></td>
                    </tr>
                    <tr>
                    </tr>
                  </table>
                  <table width="255" align="right" border="0" cellspacing="0" cellpadding="0" class="inner" style="text-align:center; margin-top: 10px">
                <tr>
                      <td class="hide" height="22">&nbsp;</td>
                    </tr>
                    <tr>
                      <td height="10">&nbsp;</td>
                    </tr>
                    <tr>
                      <td align="center" valign="middle">
                        <table width="200" align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center; margin-right: 10px">
  <tr>
  <a href="` + process.env.FRONT_END_URL + `"><td align="center" bgcolor="#f27b69" height="57" style="border-radius:28px; background: #039be5;"><a href="` + process.env.FRONT_END_URL + `" style="font-family:'Montserrat', Helvetica, Arial, sans-serif; font-weight:700; font-size:12px; line-height:57px; color:#ffffff; text-decoration:none; text-transform:uppercase; display:block; overflow:hidden; ">${translateService.translate('GO TO TACTICALPEDIA', lang)}</td></a>
  </tr>
</table>

                      </td>
                    </tr>
                     <tr>
                      <td height="40">&nbsp;</td>
                    </tr>
                  </table>
                  </td>
              </tr>
            </table></td>
        </tr>
      </table></td>
  </tr>
</table>
<!-- ----------------- Header End Here ------------------------- -->

  ` + content + `


<!-- ----------------- Footer Start Here ------------------------- -->

  <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
  <tr>
  <td align="center">
  	<table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="devicewidth">
  <tr>
    <td>
    	<table width="100%" bgcolor="#b5637e" border="0" cellspacing="0" cellpadding="0" align="center" class="full" style="border-radius:0 0 5px 5px;     background: #00263f;">
        <tr><td height="18">&nbsp;</td></tr>
  <tr>
  <td>
  <table width="340" border="0" cellspacing="0" cellpadding="0" align="right" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center;" class="inner">
  <tr>
  <td width="21">&nbsp;</td>
    <td>
    	<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
    <tr><td>
    	<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="full">
  
  <tr><td height="18">&nbsp;</td></tr>
</table>

    </td></tr>
</table>

    </td>
  </tr>
</table>
  	<table width="230" border="0" cellspacing="0" cellpadding="0" align="left" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; text-align:center;" class="inner">
  <tr>
    <td width="21">&nbsp;</td>
    <td>
    	<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
    <tr><td align="center" style="font:11px Helvetica,  Arial, sans-serif; color:#ffffff;">&copy; 2021, All rights reserved
</td></tr>
<tr><td height="18">&nbsp;</td></tr>
</table>

    </td>
    <td width="21">&nbsp;</td>
  </tr>
</table>

  </td></tr>
  </table>
    </td></tr>
    <tr class="mhide">
    <td height="100">&nbsp;</td>
    </tr>
    </table>
  </td></tr></table>
  
<!-- ----------------- Footer End Here ------------------------- -->
  
<!-- ----------------- Block 9 End Here ------------------------- -->
      `;

    }


}