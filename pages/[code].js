import prisma from "../lib/prisma";

export async function getServerSideProps(context) {
  const { code } = context.params;

  // Find the link by code
  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    // If no link found, show 404 page
    return {
      notFound: true,
    };
  }

  // Update click count + lastClicked timestamp
  await prisma.link.update({
    where: { code },
    data: {
      clicks: {
        increment: 1,
      },
      lastClicked: new Date(),
    },
  });

  // Redirect to original URL
  return {
    redirect: {
      destination: link.url,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return null; // Nothing to render. The redirect already happened.
}
