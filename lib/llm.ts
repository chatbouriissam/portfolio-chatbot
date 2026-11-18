import Groq from 'groq-sdk';
import knowledge from '@/data/knowledge.json';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function normalizeQuestion(question: string) {
  return question
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/['']/g, ' ')
    .replace(/-/g, ' ')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createKnowledgeFallback(messages: Message[]) {
  const question = messages[messages.length - 1]?.content ?? '';
  const normalized = normalizeQuestion(question);
  const isEnglish = /\b(what|who|why|how|where|when|tell|describe|your|you|his|him|experience|skills|available|hire|projects)\b/.test(normalized);
  const unknown = isEnglish
    ? `I don't have that specific information. Please contact Issam at ${knowledge.identity.email}.`
    : `Je n'ai pas cette information précise. Vous pouvez contacter Issam à ${knowledge.identity.email}.`;
  const answer = (french: string, english: string) => isEnglish ? english : french;
  const has = (...terms: string[]) => terms.some((term) => normalized.includes(term));
  const projects = knowledge.projects;
  const experiences = knowledge.experiences;

  if (/^(bonjour|salut|hello|hi|hey|bonsoir)$/.test(normalized)) {
    return answer(
      'Bonjour ! Que souhaitez-vous savoir sur le parcours, les projets ou les compétences d\'Issam ?',
      'Hello! What would you like to know about Issam\'s background, projects, or skills?',
    );
  }

  if (has('malolivier', 'olive', 'olivier')) {
    const project = projects[0];
    return answer(
      `${project.name} est un projet de détection de maladies de l'olivier par Deep Learning. Il utilise un CNN MobileNetV2 avec TensorFlow pour classifier les images, exposé par un microservice FastAPI connecté à Spring Boot. La stack comprend aussi Android, MySQL et JWT.`,
      `${project.name} detects olive tree diseases using deep learning. It uses a TensorFlow MobileNetV2 CNN to classify images, exposed through a FastAPI microservice connected to Spring Boot. The stack also includes Android, MySQL, and JWT.`,
    );
  }

  if (has('ecosmart', 'isolation forest', 'anomalie energetique', 'energy anomaly')) {
    const project = projects[1];
    return answer(
      `${project.name} est un système intelligent de gestion énergétique. Il utilise Isolation Forest pour détecter les anomalies de consommation, avec monitoring en temps réel, alertes automatiques et une API REST. Stack : ${project.stack.join(', ')}.`,
      `${project.name} is an intelligent energy-management system. It uses Isolation Forest to detect consumption anomalies, with real-time monitoring, automatic alerts, and a REST API. Stack: ${project.stack.join(', ')}.`,
    );
  }

  if (
    /pourquoi.*(recrut|embauch|chois|selection|candidat|plutot|et pas un autre)/.test(normalized) ||
    /why.*(hire|recruit|choose|select|over other)/.test(normalized) ||
    has(
      'what sets you apart',
      'good fit',
      'good candidate',
      'right candidate',
      'suitable for this role',
      'pourquoi vous',
      'qu est ce qui vous distingue',
      'what can you bring',
      'qu apportez vous',
      'rather than another',
    )
  ) {
    return answer(
      'Son profil réunit IA/Data Science et développement logiciel : il a intégré un CNN MobileNetV2 dans un service FastAPI relié à Spring Boot, et développé une détection d\'anomalies énergétiques avec Isolation Forest. Ses stages lui ont aussi apporté une expérience concrète en facturation électronique et en développement full-stack bancaire. Il recherche un stage PFE de 6 mois à partir de février 2027.',
      'Issam combines AI/Data Science with software engineering: he integrated a MobileNetV2 CNN into a FastAPI service connected to Spring Boot, and built energy-anomaly detection with Isolation Forest. His internships also gave him hands-on experience with electronic invoicing and full-stack banking software. He is seeking a six-month final-year internship starting February 2027.',
    );
  }

  if (
    has(
      'presente',
      'presentation',
      'tell me about',
      'introduce',
      'resume ton parcours',
      'resume vous',
      'about yourself',
      'parcours',
      'background',
      'qui est issam',
      'who is issam',
      'profil',
      'profile',
      '30 secondes',
      '30 seconds',
      'en bref',
      'briefly',
    ) ||
    /^(who are you|who is he|give me .* introduction|presente toi|presentez vous)$/.test(normalized)
  ) {
    if (has(
        'experience',
        'stage',
        'internship',
        'project',
        'projet',
        'skill',
        'competence',
        'formation',
        'education',
        'etude',
        'study',
        'degree',
      ) && !has('30 secondes', '30 seconds', 'en bref', 'briefly')) {
      // Skip this handler, let more specific ones handle it
    } else {
      return answer(
        `${knowledge.identity.name} est étudiant en 3e année du cycle ingénieur Génie Informatique à ${knowledge.education[0].school}, spécialisé en IA et Data Science. Il maîtrise Python, TensorFlow, scikit-learn pour le Machine Learning (CNN MobileNetV2, Isolation Forest), ainsi que Java, Spring Boot, FastAPI, Angular et Node.js pour le développement full-stack. Il a réalisé des projets concrets comme MalOlivier Detector (détection de maladies d\'oliviers par CNN) et EcoSmart BEMS (détection d\'anomalies énergétiques). Il a effectué deux stages : chez ${experiences[0].company} (signature électronique TEIF et transmission à Tunisie TradeNet) et chez ${experiences[1].company} (plateforme bancaire Angular/Node.js/Oracle). Il recherche un stage PFE de 6 mois à partir de février 2027.`,
        `${knowledge.identity.name} is a 3rd-year Computer Engineering student at ${knowledge.education[0].school}, specializing in AI and Data Science. He masters Python, TensorFlow, and scikit-learn for Machine Learning (CNN MobileNetV2, Isolation Forest), as well as Java, Spring Boot, FastAPI, Angular, and Node.js for full-stack development. He built concrete projects like MalOlivier Detector (olive disease detection with CNN) and EcoSmart BEMS (energy anomaly detection). He completed two internships: at ${experiences[0].company} (TEIF electronic signature and Tunisia TradeNet transmission) and at ${experiences[1].company} (Angular/Node.js/Oracle banking platform). He is seeking a 6-month final-year internship starting February 2027.`,
      );
    }
  }

  if (has('projet ia', 'projets ia', 'ai project', 'ai projects', 'machine learning project', 'projet machine learning')) {
    return answer(
      `Ses deux projets principaux en IA sont **${projects[0].name}**, qui classe des images de maladies de l\'olivier avec un CNN MobileNetV2 (TensorFlow), et **${projects[1].name}**, qui détecte les anomalies de consommation énergétique avec Isolation Forest. Le premier relie un service FastAPI à Spring Boot ; le second utilise FastAPI, PostgreSQL et Docker.`,
      `His two main AI projects are **${projects[0].name}**, which classifies olive-disease images with a MobileNetV2 CNN (TensorFlow), and **${projects[1].name}**, which detects energy-consumption anomalies with Isolation Forest. The first connects a FastAPI service to Spring Boot; the second uses FastAPI, PostgreSQL, and Docker.`,
    );
  }

  if (
    has(
      'motivation',
      'pourquoi ce stage',
      'pourquoi cette offre',
      'pourquoi ce poste',
      'pourquoi souhaitez vous',
      'pourquoi voulez vous',
      'pourquoi aimeriez vous',
      'pourquoi voudriez vous',
      'pourquoi cette entreprise',
      'pourquoi postulez vous',
      'pourquoi rejoindre',
      'pourquoi integrer',
      'why this internship',
      'why this role',
      'why this position',
      'why this company',
      'why do you want',
      'why would you like',
      'why are you interested',
      'why apply',
      'why did you apply',
      'why join',
      'what interests you',
      'interested in this role',
      'interested in this job',
      'what motivates you',
      'qu est ce qui vous motive',
    )
  ) {
    return answer(
      'Son intérêt pour ce stage s\'inscrit dans son parcours en Génie Informatique et sa spécialisation pratique en IA, Data Science et développement logiciel. Ses projets lui ont permis d\'appliquer le Deep Learning à la classification d\'images et le Machine Learning à la détection d\'anomalies. Pour expliquer précisément son adéquation à cette offre, il faudrait connaître les missions et les compétences recherchées.',
      'His interest in this opportunity aligns with his Computer Engineering studies and hands-on work in AI, Data Science, and software development. His projects apply deep learning to image classification and machine learning to anomaly detection. To assess his fit for this specific role, its responsibilities and requirements would need to be known.',
    );
  }

  if (
    has(
      'poste recherche',
      'type de poste',
      'quel poste',
      'looking for a role',
      'looking for a position',
      'what role',
      'career objective',
      'career goal',
      'career goals',
      'objectif professionnel',
    )
  ) {
    return answer(
      'Issam recherche un stage PFE de six mois à partir de février 2027, principalement en IA et Data Science. Il est également intéressé par des missions de développement logiciel full-stack liées à ses compétences en Python, Java, Spring Boot, FastAPI et Angular.',
      'Issam is seeking a six-month final-year internship starting in February 2027, primarily in AI and Data Science. He is also interested in full-stack software-development work related to his experience with Python, Java, Spring Boot, FastAPI, and Angular.',
    );
  }

  if (
    has(
      'disponible',
      'disponibilite',
      'availability',
      'available',
      'when can you start',
      'can you start',
      'pouvez vous commencer',
      'start date',
      'start working',
      'start in february',
      'commencer en fevrier',
      'quand peux tu commencer',
      'quand pouvez vous commencer',
      'date de debut',
      'cherche un stage',
      'recherche un stage',
      'looking for',
      'pfe',
    )
  ) {
    return answer(
      `Issam recherche un stage PFE de six mois à partir de février 2027, orienté IA et Data Science. Son profil et ses projets couvrent aussi le développement full-stack.`,
      `Issam is seeking a six-month final-year internship starting in February 2027, focused on AI and Data Science. His experience and projects also cover full-stack development.`,
    );
  }

  if (
    has(
      'experience en ia',
      'experience en machine learning',
      'experience with ai',
      'ai experience',
      'experience in machine learning',
      'machine learning experience',
    )
  ) {
    return answer(
      `Son expérience pratique en IA est documentée par deux projets : **${projects[0].name}**, où il a préparé des données d\'images et intégré un CNN MobileNetV2 avec TensorFlow à un microservice FastAPI connecté à Spring Boot, et **${projects[1].name}**, où il a utilisé Isolation Forest pour détecter des anomalies de consommation énergétique.`,
      `His hands-on AI experience is documented in two projects: **${projects[0].name}**, where he prepared image data and integrated a TensorFlow MobileNetV2 CNN into a FastAPI microservice connected to Spring Boot, and **${projects[1].name}**, where he used Isolation Forest to detect energy-consumption anomalies.`,
    );
  }

  if (has('experience', 'stage', 'internship', 'work history', 'logitechnica', 'swallow')) {
    if (has('logitechnica')) {
      return answer(
        `${experiences[0].title} chez ${experiences[0].company} (${experiences[0].period}) : Issam a développé un système de signature électronique pour des factures TEIF, intégrant des certificats qualifiés, puis transmis les factures signées à Tunisie TradeNet via API REST avec gestion des erreurs de soumission.`,
        `${experiences[0].title} at ${experiences[0].company} (${experiences[0].period}): Issam built an electronic-signature system for TEIF invoices using qualified certificates, then sent signed invoices to Tunisia TradeNet through a REST API with submission-error handling.`,
      );
    }

    if (has('swallow')) {
      return answer(
        `${experiences[1].title} chez ${experiences[1].company} (${experiences[1].period}) : Issam a développé des interfaces Angular et un back-end Node.js pour une plateforme bancaire, intégré une base Oracle et réalisé des tests fonctionnels.`,
        `${experiences[1].title} at ${experiences[1].company} (${experiences[1].period}): Issam developed Angular interfaces and a Node.js back end for a banking platform, integrated an Oracle database, and performed functional testing.`,
      );
    }

    return answer(
      `Chez ${experiences[0].company} (${experiences[0].period}), Issam a développé un système de signature électronique de factures TEIF avec transmission à Tunisie TradeNet via API REST et gestion des erreurs. Chez ${experiences[1].company} (${experiences[1].period}), il a travaillé sur une plateforme bancaire avec Angular, Node.js et Oracle, ainsi que sur des tests fonctionnels.`,
      `At ${experiences[0].company} (${experiences[0].period}), Issam built a TEIF electronic-invoice signing system and transmitted invoices to Tunisia TradeNet through a REST API with error handling. At ${experiences[1].company} (${experiences[1].period}), he worked on a banking platform using Angular, Node.js, and Oracle, and carried out functional testing.`,
    );
  }

  if (has('qualite', 'quality', 'strength', 'point fort', 'atout', 'forces')) {
    return answer(
      'Les éléments les plus concrets de son profil sont sa double orientation IA et développement logiciel, ainsi que sa capacité à intégrer des modèles dans des applications : par exemple, un CNN MobileNetV2 servi par FastAPI et relié à Spring Boot, et un système de détection d\'anomalies énergétiques avec Isolation Forest.',
      'The clearest strengths evidenced by his portfolio are his combination of AI and software development, and his experience integrating models into applications—for example, serving a MobileNetV2 CNN through FastAPI connected to Spring Boot, and building energy-anomaly detection with Isolation Forest.',
    );
  }

  if (
    has('programming language', 'programming languages', 'coding language', 'coding languages')
  ) {
    const programmingLanguages = knowledge.skills.languages.join(', ');
    return answer(
      `Issam utilise notamment ${programmingLanguages}.`,
      `Issam works with ${programmingLanguages}.`,
    );
  }

  if (
    has(
      'competence',
      'skill',
      'technologie',
      'technology',
      'stack',
      'maitrise',
      'technical',
      'framework',
      'database',
    )
  ) {
    return answer(
      `Ses compétences en IA/ML incluent Python, TensorFlow, scikit-learn, Deep Learning, CNN/MobileNetV2 et Isolation Forest. En développement, il utilise Java, Spring Boot, Python, FastAPI, Angular, Node.js et TypeScript. Il a aussi travaillé avec MySQL, Oracle, PostgreSQL, Docker, JWT et WebSocket.`,
      `His AI/ML skills include Python, TensorFlow, scikit-learn, deep learning, CNN/MobileNetV2, and Isolation Forest. For development, he uses Java, Spring Boot, Python, FastAPI, Angular, Node.js, and TypeScript. He has also worked with MySQL, Oracle, PostgreSQL, Docker, JWT, and WebSocket.`,
    );
  }

  if (has('formation', 'education', 'etude', 'school', 'university', 'diplome', 'student', 'etudiant', 'major', 'field of study')) {
    return answer(
      `Issam suit le cycle ingénieur en Génie Informatique à ${knowledge.education[0].school} (${knowledge.education[0].period}). Il a auparavant suivi le cycle préparatoire Physique-Chimie à ${knowledge.education[1].school} (${knowledge.education[1].period}).`,
      `Issam is pursuing a Computer Engineering degree at ${knowledge.education[0].school} (${knowledge.education[0].period}). Before that, he completed a Physics and Chemistry preparatory cycle at ${knowledge.education[1].school} (${knowledge.education[1].period}).`,
    );
  }

  if (has('contact', 'contacter', 'joindre', 'email', 'phone', 'telephone', 'linkedin')) {
    return answer(
      `Vous pouvez contacter Issam à ${knowledge.identity.email}, par téléphone au ${knowledge.identity.phone}, ou via LinkedIn : ${knowledge.identity.linkedin}.`,
      `You can contact Issam at ${knowledge.identity.email}, by phone at ${knowledge.identity.phone}, or on LinkedIn: ${knowledge.identity.linkedin}.`,
    );
  }

  if (has('lieu', 'location', 'where are you based', 'based in', 'ville')) {
    return answer(
      `Issam est basé à ${knowledge.identity.location}.`,
      `Issam is based in ${knowledge.identity.location}.`,
    );
  }

  if (has('langue', 'language', 'speak', 'parle')) {
    return answer(
      `Issam parle français (B2), anglais (B2) et allemand (niveau intermédiaire).`,
      `Issam speaks French (B2), English (B2), and German (intermediate level).`,
    );
  }

  if (has('certification', 'certificat', 'certified', 'certifie', 'diploma', 'diplome', 'aws', 'cisco', 'ccna', 'nvidia')) {
    const certifications = knowledge.certifications;
    return answer(
      `Issam a obtenu trois certifications professionnelles : **${certifications[0].name}** (${certifications[0].issuer}, ${certifications[0].year}), **${certifications[1].name}** (${certifications[1].issuer}, ${certifications[1].year}), et **${certifications[2].name}** (${certifications[2].issuer}, ${certifications[2].year}).`,
      `Issam holds three professional certifications: **${certifications[0].name}** (${certifications[0].issuer}, ${certifications[0].year}), **${certifications[1].name}** (${certifications[1].issuer}, ${certifications[1].year}), and **${certifications[2].name}** (${certifications[2].issuer}, ${certifications[2].year}).`,
    );
  }

  const otherProject = projects.slice(2).find((project) =>
    normalizeQuestion(`${project.name} ${project.subtitle}`)
      .split(' ')
      .some((word) => word.length > 4 && normalized.includes(word)),
  );
  if (otherProject) {
    const description = otherProject.description.join('; ');
    return answer(
      `**${otherProject.name}** : ${otherProject.subtitle}. ${description}. Technologies : ${otherProject.stack.join(', ')}.`,
      `**${otherProject.name}**: ${otherProject.subtitle}. ${description}. Technologies: ${otherProject.stack.join(', ')}.`,
    );
  }

  if (has('projet', 'project', 'realisation')) {
    const summaries = projects
      .map((project) => `**${project.name}** : ${project.subtitle}`)
      .join('\n');
    return answer(`Voici ses projets principaux :\n${summaries}`, `Here are his main projects:\n${summaries}`);
  }

  return unknown;
}

export async function* streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
): AsyncGenerator<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 700,
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
