import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './SearchSortBar.scss';

export function SearchSortBar({ search, onSearchChange, sort, onSortChange }) {
    // Render the component's JSX
    return (
        <InputGroup className="mb-3 search-sort-bar">
            <Form.Control
                type="text"
                placeholder="Search items..."

                value={search}

                onChange={(e) => onSearchChange(e.target.value)}

                aria-label="Search items"
            />
            <Form.Select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort by"
                style={{ maxWidth: '180px' }}
            >

                <option value="category">Category</option>
                <option value="priority">Priority</option>
                <option value="due">Due Date</option>
            </Form.Select>
        </InputGroup>
    );
}