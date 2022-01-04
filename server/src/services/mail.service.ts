interface IMailService {
      sendActivationMail(email: string, link: string): void;
}

class MailService implements IMailService {

      public sendActivationMail = async (email: string, link: string) => {};

}

export default new MailService();