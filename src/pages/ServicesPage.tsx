import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, Alert } from '../components/ui';

export const ServicesPage: React.FC = () => {
  return (
    <div className="services-page">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Badge variant="info" style={{ marginBottom: 'var(--space-2)' }}>
          सेवा मार्गदर्शक • Services Directory
        </Badge>
        <h1 style={{ fontSize: '2rem', color: 'var(--sahayak-blue-dark)', marginBottom: 'var(--space-2)' }}>
          Government Services & Certificates (महाराष्ट्र शासकीय सेवा)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px' }}>
          Explore required documentation, processing fees, and step-by-step application flows for certificates issued through Aaple Sarkar and the Revenue Department.
        </p>
      </div>

      <Alert variant="info" style={{ marginBottom: 'var(--space-6)' }}>
        Services data catalog will be loaded in Phase P05 (Services & Task Guidance) via shared contracts from Phase P03.
      </Alert>

      <div className="grid grid-cols-1 grid-cols-3-md" style={{ gap: 'var(--space-6)' }}>
        <Card variant="official-source">
          <CardHeader>
            <Badge variant="success" size="sm">महसूल विभाग</Badge>
            <CardTitle>Income Certificate (उत्पन्नाचा दाखला)</CardTitle>
            <CardDescription>Tahsil Office • 1 Year / 3 Years Validity</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Mandatory documents: Ration Card, Salary Slip / Talathi Income Report, Self-Declaration.
            </p>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <Badge variant="success" size="sm">सामाजिक न्याय</Badge>
            <CardTitle>Caste Certificate (जात प्रमाणपत्र)</CardTitle>
            <CardDescription>Sub-Divisional Officer (SDO) • Life-long Validity</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Mandatory documents: Primary School Leaving Certificate, Father's LC/1967 proof, Affidavit.
            </p>
          </CardBody>
        </Card>

        <Card variant="official-source">
          <CardHeader>
            <Badge variant="success" size="sm">अन्न व नागरी पुरवठा</Badge>
            <CardTitle>Ration Card Services (रेशन कार्ड सेवा)</CardTitle>
            <CardDescription>District Supply Office • Food Security</CardDescription>
          </CardHeader>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Addition of member, modification, surrender, and duplicate ration card issuance.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
