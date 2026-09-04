import SignInForm from '../components/SignInForm.jsx'
import SignUpForm from '../components/SignUpForm.jsx'


function SplashPage() {
  return (
    <div className="splash-page">
      <section className="splash-hero">
        <h1>SHOW MOI</h1>
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
