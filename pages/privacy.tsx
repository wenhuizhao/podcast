import Link from 'next/link';

const Privacy = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white min-h-screen flex flex-col items-strech">
    <header className="shadow-md bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2">
      <nav className="container mx-auto py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center">NotebookVideo</h1>
        <ul className="flex space-x-8">
          <li>
            <Link href="/" className="text-white font-bold hover:text-blue-800">
              Home
            </Link>
          </li>
          <li>
            <Link href="/" className="text-white font-bold hover:text-blue-800">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/" className="text-white font-bold hover:text-blue-800">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
    <main className="flex flex-grow flex-col container mx-auto p-2 flex flex-col items-center">
      <h2>Privacy Policy</h2>
      <p>NotebookVideo.com is a website for converting audio to video.</p>
      <p>
        This page is used to inform website visitors regarding our policies with
        the collection, use, and disclosure of Personal Information if anyone
        decided to use our Service.
      </p>
      <p>
        If you choose to use our Service, then you agree to the collection and
        use of information in relation with this policy. The Personal
        Information that we collect are used for providing and improving the
        Service. We will not use or share your information with anyone except as
        described in this Privacy Policy.
      </p>

      <p>
        <strong>Information Collection and Use</strong>
      </p>
      <p>
        For a better experience while using our Service, we may require you to
        provide certain personally identifiable information, including but not
        limited to email, user name. When you choose login by google, we only
        request your google email, name and profile avatar. Those are only used
        to serve the user experience. The information that we request will be
        retained by us and used as described in this privacy policy. We will not
        share those information with any third party.
      </p>
      <p>
        The website does use third party services that may collect information
        used to identify you. Here is the link to
        <Link href="https://policies.google.com/privacy">
          Google Sign-in and Google Drive Services privacy policy
        </Link>
      </p>
      <p>
        <strong>Log Data</strong>
      </p>
      <p>
        We want to inform you that whenever you use our Service, in case of an
        error in the website we collect data and information (through third
        party products) on your phone called Log Data. This Log Data may include
        information such as your devices’s Internet Protocol (“IP”) address,
        device name, operating system version, configuration of the website when
        utilising our Service, the time and date of your use of the Service, and
        other statistics.
      </p>

      <p>
        <strong>Service Providers</strong>
      </p>
      <p>
        We may employ third-party companies and individuals due to the following
        reasons:
      </p>
      <ul>
        <li>To facilitate our Service;</li>
        <li>To provide the Service on our behalf;</li>
        <li>To perform Service-related services; or</li>
        <li>To assist us in analyzing how our Service is used.</li>
      </ul>
      <p>
        We want to inform users of this Service that these third parties have
        access to your Personal Information. The reason is to perform the tasks
        assigned to them on our behalf. However, they are obligated not to
        disclose or use the information for any other purpose.
      </p>

      <p>
        <strong>Security</strong>
      </p>
      <p>
        We value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and we cannot guarantee
        its absolute security.
      </p>

      <p>
        <strong>Links to Other Sites</strong>
      </p>
      <p>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites are not operated by us. Therefore, I strongly advise you
        to review the Privacy Policy of these websites. I have no control over,
        and assume no responsibility for the content, privacy policies, or
        practices of any third-party sites or services.
      </p>

      <p>
        <strong>Children’s Privacy</strong>
      </p>
      <p>
        This Service does not address anyone under the age of 13. We do not
        knowingly collect personal identifiable information from children under
        13. In the case we discover that a child under 13 has provided us with
        personal information, we immediately delete this from our servers. If
        you are a parent or guardian and you are aware that your child has
        provided us with personal information, please contact us so that we will
        be able to do necessary actions.
      </p>

      <p>
        <strong>Changes to This Privacy Policy</strong>
      </p>
      <p>
        We may update our Privacy Policy from time to time. Thus, you are
        advised to review this page periodically for any changes. We will notify
        you of any changes by posting the new Privacy Policy on this page. These
        changes are effective immediately, after they are posted on this page.
      </p>

      <p>
        <strong>Contact Us</strong>
      </p>
      <p>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us.
      </p>
    </main>
    <footer className="bg-blue-600 text-white text-center py-4 mt-auto w-full">
      &copy; 2024 NotebookVideo. All Rights Reserved. |{' '}
      <Link href="/term">Term</Link> | <Link href="/privacy">Privacy</Link>
    </footer>
  </div>
);

export default Privacy;
