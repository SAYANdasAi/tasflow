import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ComparisonTool from "@/components/comparison-tool"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

import styles from "@/styles/comparison.module.css"

export default async function ComparisonPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className={styles.comparisonPage}>
      <Navbar />
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Answer Script Comparison</h1>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Upload your answer script and compare it with a reference answer to get detailed analysis
            </p>
          </div>

          <ComparisonTool />
        </div>
      </section>
      <Footer />
    </div>
  )
}

