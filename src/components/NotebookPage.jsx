import React, { useLayoutEffect, useRef, useState } from 'react';
import NotebookPushpin from './NotebookPushpin';

export const NotebookInkLine = ({ children, className = '', ...props }) => (
    <div {...props} className={`notebook-ink-line ${className}`.trim()}>
        <span className="notebook-ink-content">{children}</span>
    </div>
);

const getInitialLineModel = section => {
    switch (section.type) {
    case 'contact':
        return section.items.map(item => ({ ...item, textLines: [item.value] }));
    case 'summary':
        return section.items.map((text, index) => ({ text, isNote: index === 1 }));
    case 'projects':
        return section.items.map(item => ({ ...item, summaryLines: [item.summary] }));
    default:
        return section.items.map(item => ({ text: String(item) }));
    }
};

const getWrappedLines = (text, context, maxWidth) => {
    const lines = [];
    let line = '';

    text.trim().split(/\s+/).forEach(word => {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > maxWidth) {
            lines.push(line);
            line = word;
        } else {
            line = candidate;
        }
    });

    if (line) lines.push(line);
    return lines;
};

const getMeasuredLineModel = (section, page) => {
    const measureTarget = page.querySelector('[data-notebook-line-measure]');
    if (!measureTarget?.clientWidth) return getInitialLineModel(section);

    const context = document.createElement('canvas').getContext('2d');
    context.font = window.getComputedStyle(measureTarget).font;
    const width = measureTarget.clientWidth;

    switch (section.type) {
    case 'contact':
        return section.items.map(item => ({ ...item, textLines: getWrappedLines(item.value, context, width) }));
    case 'summary':
        return section.items.flatMap((text, index) => (
            getWrappedLines(text, context, width).map(line => ({ text: line, isNote: index === 1 }))
        ));
    case 'projects':
        return section.items.map((item, index) => {
            const article = page.querySelectorAll('.notebook-project-entry')[index];
            return { ...item, summaryLines: getWrappedLines(item.summary, context, article?.clientWidth || width) };
        });
    default:
        return getInitialLineModel(section);
    }
};

const ExternalLink = ({ href, children, label }) => {
    const opensNewWindow = href.startsWith('http');

    return (
        <a
            href={href}
            aria-label={`${label}${opensNewWindow ? ' (opens in a new tab)' : ''}`}
            target={opensNewWindow ? '_blank' : undefined}
            rel={opensNewWindow ? 'noreferrer' : undefined}
        >
            {children}
        </a>
    );
};

const ContactContent = ({ items, animated }) => {
    const Wrapper = animated ? NotebookInkLine : 'div';

    return (
        <div className="notebook-contact-list">
            {items.flatMap(item => item.textLines.map((text, index) => (
                <Wrapper
                    key={`${item.label}-${index}`}
                    className="notebook-contact-row"
                    data-notebook-line-measure={index === 0 ? 'contact' : undefined}
                >
                    {index === 0 ? (
                        <ExternalLink href={item.href} label={`${item.label}: ${item.value}`}>{text}</ExternalLink>
                    ) : (
                        <span aria-hidden="true">{text}</span>
                    )}
                </Wrapper>
            )))}</div>
    );
};

const SummaryContent = ({ items, animated }) => {
    const Wrapper = animated ? NotebookInkLine : 'p';
    return (
        <div className="notebook-summary-copy" data-notebook-line-measure="summary">
            {items.map(({ text, isNote }, index) => (
                <Wrapper key={`${index}-${text}`} className={isNote ? 'notebook-summary-note' : ''}>{text}</Wrapper>
            ))}
        </div>
    );
};

const ProjectsContent = ({ items, animated }) => (
    <div className="notebook-project-list">
        {items.map(project => {
            const Wrapper = animated ? NotebookInkLine : 'span';
            return (
                <article key={project.title} className="notebook-project-entry">
                    <Wrapper className="notebook-project-heading-line">
                        <span className="notebook-project-heading">
                            {project.url ? <ExternalLink href={project.url} label={`${project.title} project`}>{project.title}</ExternalLink> : project.title}
                            <span>{project.category}</span>
                        </span>
                    </Wrapper>
                    {project.summaryLines.map((line, index) => (
                        <Wrapper key={`${project.title}-${index}`} className="notebook-project-summary" data-notebook-line-measure={index === 0 ? 'project' : undefined}>{line}</Wrapper>
                    ))}
                </article>
            );
        })}
    </div>
);

const GenericContent = ({ items, animated }) => {
    const Wrapper = animated ? NotebookInkLine : 'p';
    return <div className="notebook-summary-copy">{items.map(({ text }, index) => <Wrapper key={`${index}-${text}`}>{text}</Wrapper>)}</div>;
};

const contentByType = { contact: ContactContent, summary: SummaryContent, projects: ProjectsContent };

const NotebookPage = ({ section, animated = false, className = '', layoutVersion = 0, onLayoutReady }) => {
    const pageRef = useRef(null);
    const [lineModel, setLineModel] = useState(() => getInitialLineModel(section));
    const [layoutTick, setLayoutTick] = useState(0);
    const Content = contentByType[section.type] || GenericContent;
    const titleId = `${animated ? 'animated' : 'static'}-${section.id}-title`;

    useLayoutEffect(() => {
        if (!animated) return undefined;
        const page = pageRef.current;
        if (!page) {
            onLayoutReady?.(section.id, layoutVersion);
            return undefined;
        }

        let frame;
        let layoutSettled = false;
        const measureLines = () => {
            const nextModel = getMeasuredLineModel(section, page);
            if (JSON.stringify(nextModel) !== JSON.stringify(lineModel)) {
                setLineModel(nextModel);
                return;
            }

            if (frame) window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                layoutSettled = true;
                observer.disconnect();
                onLayoutReady?.(section.id, layoutVersion);
            });
        };
        const observer = new ResizeObserver(() => {
            if (!layoutSettled) setLayoutTick(tick => tick + 1);
        });

        observer.observe(page);
        measureLines();
        return () => {
            observer.disconnect();
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [animated, layoutTick, layoutVersion, lineModel, onLayoutReady, section]);

    return (
        <article ref={pageRef} className={`notebook-paper notebook-paper-${section.id} ${className}`.trim()} data-notebook-page={section.id} aria-labelledby={titleId}>
            <span className="notebook-paper-fibers" aria-hidden="true" />
            <span className="notebook-tear-edge" aria-hidden="true" />
            {section.pin && animated && <NotebookPushpin />}
            <header className={`notebook-paper-header${section.type === 'contact' ? ' notebook-paper-header-contact' : ''}`}>
                {section.eyebrow && <p>{section.eyebrow}</p>}
                {section.type === 'contact' && animated ? <h2 id={titleId} className="notebook-visually-hidden">{section.title}</h2> : (
                    animated ? <NotebookInkLine className="notebook-title-line"><h2 id={titleId}>{section.title}</h2></NotebookInkLine> : <h2 id={titleId}>{section.title}</h2>
                )}
            </header>
            <Content items={lineModel} animated={animated} />
            <span className="notebook-page-number" aria-hidden="true">{section.pageNumber}</span>
        </article>
    );
};

export default NotebookPage;
