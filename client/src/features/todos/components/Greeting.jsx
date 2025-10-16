import PropTypes from 'prop-types';

export function Greeting({ userName }) {
    return (
        <div className="card mb-3">
            <div className="card-body text-center">
                <h2 className="card-title">Hello, {userName || 'there'}! </h2>
                <p className="card-text text-muted">Let's make today productive!</p>
            </div>
        </div>
    );
}

Greeting.propTypes = {
    userName: PropTypes.string,
};
