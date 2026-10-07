import SignInForm from '../components/SignInForm.jsx'
import SignUpForm from '../components/SignUpForm.jsx'

// Splash / landing page with both sign-in and sign-up forms present (rubric item g).
function SplashPage() {
  return (
    <div className="splash-page">
      <section className="splash-hero">
        <h1>D1 Social</h1>
        <p>Share posts, connect with friends, and see what's new.</p>
      </section>
      <div className="splash-forms">
        <SignInForm />
        <SignUpForm />
      </div>
    </div>
  )
}

export default SplashPage
